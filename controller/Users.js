import jwt from "jsonwebtoken";
import { Users } from "../model/Users.js";
import { Op } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";
import { logUserActivity } from "../config/LogActivity.js";
import { Role } from "../model/Role.js";
import { LocationCCC } from "../model/Location.js";
import ParkingLocation from "../model/LocationParking.js";

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
    httpOnly: false,
    secure: false,
    expires: new Date(Date.now() + (rememberMe ? 30 : 1) * 24 * 60 * 60 * 1000),
    // sameSite: "None",
  });

  res.status(statusCode).json({
    status: "success",
    token,
    message: "Login Successfully",
  });
};

export const login = async (req, res) => {
  const { identidfier, password, rememberMe = true } = req.body;
  const ip_address = req.ip;
  console.log(req.body);
  if (!identidfier || !password) {
    return res.status(400).json({
      status: "fail",
      message:
        "Please provide an identidfier (username or email) and password!",
    });
  }

  // Find user by username, email, or phone number
  const user = await Users.findOne({
    where: {
      [Op.or]: [{ name: identidfier }, { email: identidfier }],
    },
  });

  if (!user || !(await user.correctPassword(password, user.password))) {
    return res.status(401).json({
      status: "fail",
      message: "Incorrect identidfier or password",
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

// export const register = async (req, res) => {
//   try {
//     const users = await Users.findByPk(req.userId);
//     // const roleId = req.roleId;
//     console.log(users.name);
//     const { username, email, password, phone, idLokasi, idRole } = req.body;

//     const newUser = await Users.create({
//       name: username,
//       email: email,
//       password: password,
//       no_tlp: phone,
//       id_lokasi: idLokasi,
//       id_role: idRole,
//       is_active: "1",
//       createdBy: users.name,
//     });
//     console.log(newUser);

//     // await MemberUserRole.create({
//     //   UserId: newUser.id,
//     //   RoleId: roleId || 1,
//     // });
//     const activationToken = newUser.createActivationToken();
//     await newUser.save({ validate: false });

//     const activationURL = `${req.protocol}://${req.get(
//       "host"
//     )}/v01/member/api/auth/activate/${activationToken}`;

//     const transporter = nodemailer.createTransport({
//       host: "smtp.office365.com", // Server SMTP Outlook
//       port: 587, // Port SMTP
//       secure: false,
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: newUser.email,
//       subject: "Account Activation",
//       text: `Please activate your account by clicking on the link: ${activationURL}`,
//     };

//     await transporter.sendMail(mailOptions);

//     createSendToken(newUser, 201, res);
//     await logUserActivity(users.id, "User logged in", "LOGIN", ip_address);
//   } catch (err) {
//     res.status(400).json({
//       status: "fail",
//       message: err.message,
//       errors: err.errors,
//     });
//   }
// };

export const register = async (req, res) => {
  try {
    // const users = await Users.findByPk(req.userId);
    // if (!users) {
    //   return res.status(404).json({ message: "User not found" });
    // }

    const { username, email, password, phone, idLokasi, idRole } = req.body;

    // Buat user baru langsung aktif
    const newUser = await Users.create({
      name: username,
      email: email,
      password: password, // **Pastikan password di-hash!**
      no_tlp: phone,
      id_lokasi: idLokasi,
      id_role: idRole,
      is_active: "1", // User langsung aktif tanpa aktivasi email
      createdBy: "admin",
    });

    console.log("✅ User registered:", newUser);

    // Kirim token login langsung (jika ingin auto-login setelah register)
    // createSendToken(newUser, 201, res);
    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      newUser,
    });

    // Log aktivitas user
    await logUserActivity("users.id", "User registered", "REGISTER");
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
      errors: err.errors,
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
    const userById = await Users.findByPk(req.userId, {
      include: [
        {
          model: LocationCCC,
          attributes: ["id", "name"],
        },
        {
          model: ParkingLocation,
          attributes: ["id", "LocationCode", "LocationName"],
        },
      ],
    });

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

export const getAllUsers = async (req, res) => {
  try {
    const users = await Users.findAll({
      include: [
        {
          model: LocationCCC,
          attributes: ["id", "name"],
        },
      ],
      attributes: ["id", "name", "isOnline", "last_active"],
    });

    res.status(200).json({
      statusCode: 200,
      message: "Users retrieved successfully",
      data: users,
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
    expires: new Date(0),
    httpOnly: true,
    // secure: process.env.NODE_ENV === "production",  // Hanya secure di production (HTTPS)
    // sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",  // SameSite none untuk secure
  });

  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
};
