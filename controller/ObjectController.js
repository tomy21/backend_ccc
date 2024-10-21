import { Description } from "../model/Description.js";
import { Op } from "sequelize";
import { CategoryModel } from "../model/CategoryModel.js";
import { Users } from "../model/Users.js";

export const createDescription = async (req, res) => {
  const { id_category, object } = req.body;

  try {
    const users = await Users.findByPk(req.userId);
    const newDescription = await Description.create({
      id_category,
      object,
      createdBy: users.name,
    });
    res.status(201).json({
      success: true,
      message: "Description created successfully",
      data: newDescription,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ - Mendapatkan semua data Object
export const getAllDescription = async (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;

  try {
    const offset = (page - 1) * limit;
    const { count, rows } = await Description.findAndCountAll({
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
export const getDescriptionById = async (req, res) => {
  const { idCategory } = req.query;

  try {
    const descripton = await Description.findAll({
      where: { id_category: idCategory },
      include: [
        {
          model: CategoryModel,
          as: "category", // Alias yang diberikan di model relasi
          attributes: ["category"], // Sertakan nama kategori
        },
      ],
    });

    if (descripton) {
      res.status(200).json({
        success: true,
        message: "get successfully",
        data: descripton,
      });
    } else {
      res.status(404).json({ message: "Object tidak ditemukan" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE - Memperbarui Object berdasarkan ID
export const updateDescription = async (req, res) => {
  const { id } = req.params;
  const { id_category, object } = req.body;

  try {
    const existingDescription = await Description.findByPk(id);

    if (!existingObject) {
      return res.status(404).json({ message: "Object tidak ditemukan" });
    }

    existingDescription.id_category = id_category;
    existingDescription.object = object;

    await existingDescription.save();
    res.status(200).json(existingObject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE - Menghapus Object berdasarkan ID
export const deleteDescription = async (req, res) => {
  const { id } = req.params;

  try {
    const description = await Description.findByPk(id);

    if (!description) {
      return res.status(404).json({ message: "description tidak ditemukan" });
    }

    await description.destroy(); // Soft delete
    res.status(200).json({ message: "description berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
