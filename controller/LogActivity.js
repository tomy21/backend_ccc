import { Op } from "sequelize";
import { OccLogActivity } from "../model/OccLogActivity.js";
import { Users } from "../model/Users.js";

// Create
export const createLogActivity = async (req, res) => {
  const { id_users, activity, action, ip_address } = req.body;
  try {
    const newLog = await OccLogActivity.create({
      id_users,
      activity,
      action,
      ip_address,
    });
    res.status(201).json(newLog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Read All
export const getAllLogActivities = async (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;

  // Mengonversi page dan limit ke tipe angka
  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  // Hitung offset untuk pagination
  const offset = (pageNumber - 1) * limitNumber;

  try {
    const { count, rows } = await OccLogActivity.findAndCountAll({
      where: {
        action: {
          [Op.like]: `%${search}%`, // Mencari berdasarkan activity
        },
      },
      include: [
        {
          model: Users,
        },
      ],
      limit: limitNumber,
      offset: offset,
      order: [["createdAt", "DESC"]], // Mengurutkan berdasarkan tanggal dibuat
    });

    res.status(200).json({
      totalItems: count,
      totalPages: Math.ceil(count / limitNumber),
      currentPage: pageNumber,
      logs: rows,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Read by ID
export const getLogActivityById = async (req, res) => {
  const { id } = req.params;
  try {
    const log = await OccLogActivity.findByPk(id);
    if (!log) {
      return res.status(404).json({ message: "Log not found" });
    }
    res.status(200).json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update
export const updateLogActivity = async (req, res) => {
  const { id } = req.params;
  const { id_users, activity, action, ip_address } = req.body;

  try {
    const log = await OccLogActivity.findByPk(id);
    if (!log) {
      return res.status(404).json({ message: "Log not found" });
    }

    log.id_users = id_users || log.id_users;
    log.activity = activity || log.activity;
    log.action = action || log.action;
    log.ip_address = ip_address || log.ip_address;

    await log.save();

    res.status(200).json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete
export const deleteLogActivity = async (req, res) => {
  const { id } = req.params;
  try {
    const log = await OccLogActivity.findByPk(id);
    if (!log) {
      return res.status(404).json({ message: "Log not found" });
    }

    await log.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
