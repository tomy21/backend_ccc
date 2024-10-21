import jwt from "jsonwebtoken";
import { Users } from "../model/Users.js";
import { Op } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";
import { logUserActivity } from "../config/LogActivity.js";

const signToken = (user, rememberMe) => {
  const expiresIn = rememberMe ? "30d" : "1d";

  const payload = {
    Id: user.id,
    email: user.email,
    iat: Math.floor(Date.now() / 1000),
    iss: "https://skyparking.online",
    jti: uuidv4(),
    nbf: Math.floor(Date.now() / 1000),
    role: user.id_role,
    sub: user.name,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn,
  });

  return token;
};

const createSendToken = (user, statusCode, res, rememberMe) => {
  const token = signToken(user, rememberMe);

  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(Date.now() + (rememberMe ? 30 : 1) * 24 * 60 * 60 * 1000),
  });

  res.status(statusCode).json({
    status: "success",
    token,
    message: "Login Successfully",
  });
};

export const login = async (req, res) => {
  const { identifier, password, rememberMe } = req.body;
  const ip_address = req.ip;

  if (!identifier || !password) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide an identifier (username or email) and password!",
    });
  }

  // Find user by username, email, or phone number
  const user = await Users.findOne({
    where: {
      [Op.or]: [{ name: identifier }, { email: identifier }],
    },
  });

  if (!user || !(await user.correctPassword(password, user.password))) {
    return res.status(401).json({
      status: "fail",
      message: "Incorrect identifier or password",
    });
  }

  // Update the last login time
  user.last_active = new Date();
  user.isOnline = true;
  await user.save({ validate: false });

  await logUserActivity(user.id, "User logged in", "LOGIN", ip_address);
  // Pass rememberMe flag to createSendToken function
  createSendToken(user, 200, res, rememberMe);
};

export const register = async (req, res) => {
  try {
    const users = await Users.findByPk(req.userId);
    const { username, email, password, phone, idLokasi } = req.body;

    console.log(req.body);
    const newUser = await Users.create({
      name: username,
      email: email,
      password: password,
      no_tlp: phone,
      id_lokasi: idLokasi,
      id_role: 1,
      is_active: "1",
      createdBy: users.name,
    });

    //   await MemberUserRole.create({
    //     UserId: newUser.id,
    //     RoleId: roleId || 4,
    //   });
    const activationToken = newUser.createActivationToken();
    await newUser.save({ validate: false });

    const activationURL = `${req.protocol}://${req.get(
      "host"
    )}/v01/member/api/auth/activate/${activationToken}`;

    const transporter = nodemailer.createTransport({
      host: "smtp.office365.com", // Server SMTP Outlook
      port: 587, // Port SMTP
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: newUser.email,
      subject: "Account Activation",
      text: `Please activate your account by clicking on the link: ${activationURL}`,
    };

    await transporter.sendMail(mailOptions);

    createSendToken(newUser, 201, res);
    await logUserActivity(user.id, "User logged in", "LOGIN", ip_address);
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

export const activateAccount = async (req, res) => {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await Users.findOne({
      where: {
        activation_token: hashedToken,
        activation_expires: { [Op.gt]: Date.now() },
      },
    });

    if (!user) {
      return res.status(400).json({
        status: "fail",
        message: "Token is invalid or has expired",
      });
    }

    user.email_confirmation = 1;
    user.activation_token = null;
    user.activation_expires = null;
    await user.save();

    // Redirect ke halaman setelah sukses aktivasi
    res.redirect("http://localhost:3008");
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const userById = await Users.findByPk(req.userId);

    if (!userById) {
      return res.status(404).json({
        statusCode: 404,
        message: "No users found with that ID",
      });
    }
    res.status(200).json({
      statusCode: 200,
      message: "Users retrieved successfully",
      data: userById,
    });
  } catch (err) {
    res.status(400).json({
      statusCode: 400,
      message: err.message,
    });
  }
};

export const logout = async (req, res) => {
  const user = await Users.findByPk(req.userId);
  user.isOnline = false;
  await user.save({ validate: false });

  res.cookie("refreshToken", "", {
    expires: new Date(0), // Hapus cookie segera dengan mengatur tanggal kedaluwarsa ke masa lalu
    httpOnly: true,
    // secure: process.env.NODE_ENV === "production",  // Hanya secure di production (HTTPS)
    // sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",  // SameSite none untuk secure
  });

  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
};
