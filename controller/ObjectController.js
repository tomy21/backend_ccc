import { Object } from "../model/Object.js";
import { CategoryModel } from "../model/CategoryModel.js";
import { Op } from "sequelize";

// CREATE - Menambah Object baru
export const createObject = async (req, res) => {
  const { id_category, object } = req.body;

  try {
    const newObject = await Object.create({
      id_category,
      object,
    });
    res.status(201).json(newObject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ - Mendapatkan semua data Object
export const getAllObjects = async (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;

  try {
    const offset = (page - 1) * limit;
    const { count, rows } = await Object.findAndCountAll({
      where: {
        object: {
          [Op.like]: `%${search}%`,
        },
      },
      include: [
        {
          model: CategoryModel,
          as: "category", // Alias yang diberikan di model relasi
          attributes: ["category"],
        },
      ],
      limit: parseInt(limit, 10),
      offset: offset,
    });

    res.status(200).json({
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      objects: rows,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ - Mendapatkan Object berdasarkan ID
export const getObjectById = async (req, res) => {
  const { id } = req.params;

  try {
    const object = await Object.findByPk(id, {
      include: [
        {
          model: CategoryModel,
          as: "category", // Alias yang diberikan di model relasi
          attributes: ["category"], // Sertakan nama kategori
        },
      ],
    });

    if (object) {
      res.status(200).json(object);
    } else {
      res.status(404).json({ message: "Object tidak ditemukan" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE - Memperbarui Object berdasarkan ID
export const updateObject = async (req, res) => {
  const { id } = req.params;
  const { id_category, object } = req.body;

  try {
    const existingObject = await Object.findByPk(id);

    if (!existingObject) {
      return res.status(404).json({ message: "Object tidak ditemukan" });
    }

    existingObject.id_category = id_category;
    existingObject.object = object;

    await existingObject.save();
    res.status(200).json(existingObject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE - Menghapus Object berdasarkan ID
export const deleteObject = async (req, res) => {
  const { id } = req.params;

  try {
    const object = await Object.findByPk(id);

    if (!object) {
      return res.status(404).json({ message: "Object tidak ditemukan" });
    }

    await object.destroy(); // Soft delete
    res.status(200).json({ message: "Object berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
