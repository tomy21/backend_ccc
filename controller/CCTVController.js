import { CCTV } from "../model/CCTV.js";
import { LocationCCC } from "../model/Location.js";
import { Op } from "sequelize";

// ✅ Create CCTV (Tambah Data Baru)
export const createCCTV = async (req, res) => {
  try {
    const { id_lokasi, ip_cctv, rtsp_url, capture_url, channel, is_active } =
      req.body;

    if (!id_lokasi) {
      return res.status(400).json({ message: "ID lokasi wajib diisi" });
    }

    const newCCTV = await CCTV.create({
      id_lokasi,
      ip_cctv,
      rtsp_url,
      capture_url,
      channel,
      is_active,
    });

    res
      .status(201)
      .json({ message: "CCTV berhasil ditambahkan", data: newCCTV });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get All CCTV (Dengan Pagination & Search)
export const getAllCCTV = async (req, res) => {
  try {
    let { page, limit, search } = req.query;
    page = page ? parseInt(page) : 1;
    limit = limit ? parseInt(limit) : 10;
    const offset = (page - 1) * limit;

    const whereCondition = {};

    if (search) {
      whereCondition[Op.or] = [
        { ip_cctv: { [Op.like]: `%${search}%` } },
        { rtsp_url: { [Op.like]: `%${search}%` } },
        { capture_url: { [Op.like]: `%${search}%` } },
        { channel: { [Op.like]: `%${search}%` } },
      ];
    }

    const { rows, count } = await CCTV.findAndCountAll({
      where: whereCondition,
      include: [{ model: LocationCCC, as: "location" }],
      limit,
      offset,
      order: [["created_at", "DESC"]],
    });

    res.json({
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
      data: rows,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get CCTV By ID
export const getCCTVById = async (req, res) => {
  try {
    const cctv = await CCTV.findByPk(req.params.id, {
      include: [{ model: LocationCCC, as: "location" }],
    });

    if (!cctv) {
      return res.status(404).json({ message: "CCTV tidak ditemukan" });
    }

    res.json(cctv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get CCTV By Lokasi (Dengan Pagination & Search)
export const getCCTVByLokasi = async (req, res) => {
  try {
    let { page, limit, search } = req.query;
    page = page ? parseInt(page) : 1;
    limit = limit ? parseInt(limit) : 10;
    const offset = (page - 1) * limit;

    const whereCondition = { id_lokasi: req.params.id_lokasi };

    if (search) {
      whereCondition[Op.or] = [
        { ip_cctv: { [Op.like]: `%${search}%` } },
        { rtsp_url: { [Op.like]: `%${search}%` } },
        { capture_url: { [Op.like]: `%${search}%` } },
        { channel: { [Op.like]: `%${search}%` } },
      ];
    }

    const { rows, count } = await CCTV.findAndCountAll({
      where: whereCondition,
      include: [{ model: LocationCCC, as: "location" }],
      limit,
      offset,
      order: [["created_at", "DESC"]],
    });

    res.json({
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
      data: rows,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update CCTV
export const updateCCTV = async (req, res) => {
  try {
    const cctv = await CCTV.findByPk(req.params.id);
    if (!cctv) {
      return res.status(404).json({ message: "CCTV tidak ditemukan" });
    }

    await cctv.update(req.body);
    res.json({ message: "CCTV berhasil diperbarui", data: cctv });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete CCTV (Soft Delete)
export const deleteCCTV = async (req, res) => {
  try {
    const cctv = await CCTV.findByPk(req.params.id);
    if (!cctv) {
      return res.status(404).json({ message: "CCTV tidak ditemukan" });
    }

    await cctv.destroy();
    res.json({ message: "CCTV berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
