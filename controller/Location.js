import { Op } from "sequelize";
import { LocationCCC } from "../model/Location.js";

// Get All Locations
export const getAllLocations = async (req, res) => {
  try {
    let { page, limit, search } = req.query;

    // Default pagination settings
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const offset = (page - 1) * limit;

    // Opsi pencarian jika ada query "search"
    const whereCondition = search
      ? {
          [Op.and]: [
            {
              [Op.or]: [
                { Code: { [Op.like]: `%${search}%` } },
                { Name: { [Op.like]: `%${search}%` } },
                { Region: { [Op.like]: `%${search}%` } },
              ],
            },
            { recordStatus: "1" }, // Jika ENUM menggunakan string
          ],
        }
      : { recordStatus: "1" };

    // Ambil data dengan paginasi
    const { count, rows } = await LocationCCC.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [["CreatedAt", "DESC"]], // Urut berdasarkan tanggal terbaru
    });

    return res.status(200).json({
      status: "success",
      message: "Data lokasi berhasil diambil",
      data: rows,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalData: count,
        perPage: limit,
      },
    });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
};

export const getLocationsAll = async (req, res) => {
  try {
    let { page, limit, search } = req.query;

    // Default pagination settings
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const offset = (page - 1) * limit;

    // Opsi pencarian jika ada query "search"
    const whereCondition = search
      ? {
          [Op.and]: [
            {
              [Op.or]: [
                { Code: { [Op.like]: `%${search}%` } },
                { Name: { [Op.like]: `%${search}%` } },
                { Region: { [Op.like]: `%${search}%` } },
              ],
            },
            { recordStatus: "0" }, // Jika ENUM menggunakan string
          ],
        }
      : { recordStatus: "0" };

    // Ambil data dengan paginasi
    const { count, rows } = await LocationCCC.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [["CreatedAt", "DESC"]], // Urut berdasarkan tanggal terbaru
    });

    return res.status(200).json({
      status: "success",
      message: "Data lokasi berhasil diambil",
      data: rows,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalData: count,
        perPage: limit,
      },
    });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
};

// Get Location By ID
export const getLocationById = async (req, res) => {
  try {
    const location = await LocationCCC.findByPk(req.params.id);
    if (!location) {
      return res
        .status(404)
        .json({ success: false, message: "Location not found" });
    }
    res.json({ success: true, data: location });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create New Location
export const createLocation = async (req, res) => {
  try {
    const newLocation = await LocationCCC.create(req.body);
    res.status(201).json({ success: true, data: newLocation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Location By ID
export const updateLocation = async (req, res) => {
  try {
    const location = await LocationCCC.findByPk(req.params.id);
    if (!location) {
      return res
        .status(404)
        .json({ success: false, message: "Location not found" });
    }
    await location.update(req.body);
    res.json({ success: true, data: location });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Soft Delete Location By ID
export const deleteLocation = async (req, res) => {
  try {
    const location = await LocationCCC.findByPk(req.params.id);
    if (!location) {
      return res
        .status(404)
        .json({ success: false, message: "Location not found" });
    }
    await location.destroy();
    res.json({ success: true, message: "Location deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
