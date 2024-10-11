import { Op } from "sequelize";
import { CategoryModel } from "../model/CategoryModel.js";

// Get all categories with pagination and search
export const getAllCategories = async (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;

  try {
    const offset = (page - 1) * limit;
    const { count, rows } = await CategoryModel.findAndCountAll({
      where: {
        category: {
          [Op.like]: `%${search}%`, // Search functionality
        },
      },
      limit: parseInt(limit, 10),
      offset: offset,
    });

    res.status(200).json({
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      limit: limit,
      currentPage: page,
      categories: rows,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get category by ID
export const getCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await CategoryModel.findByPk(id);
    if (category) {
      res.status(200).json(category);
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
