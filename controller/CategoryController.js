import { Op } from "sequelize";
import { CategoryModel } from "../model/CategoryModel.js";
import { Users } from "../model/Users.js";

// Create a new category with basic validation
export const createCategory = async (req, res) => {
  const { category } = req.body;

  if (!category) {
    return res.status(400).json({ message: "Category name is required" });
  }

  try {
    const users = await Users.findByPk(req.userId);
    const newCategory = await CategoryModel.create({
      category,
      createdBy: users.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res
      .status(201)
      .json({ message: "Category created successfully", newCategory });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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
      res.status(200).json({ code: 200, status: "success", category });
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { category } = req.body;

  try {
    const users = await Users.findByPk(req.userId);
    const categoryToUpdate = await CategoryModel.findByPk(id);

    if (categoryToUpdate) {
      // Update the category
      await CategoryModel.update(
        { category, modifyBy: users.name },
        { where: { id } }
      );
      res.status(200).json({ message: "Category updated successfully" });
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Soft delete a category by ID
export const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const categoryToDelete = await CategoryModel.findByPk(id);

    if (categoryToDelete) {
      // Perform soft delete
      await CategoryModel.destroy({
        where: { id },
      });
      res
        .status(200)
        .json({ message: "Category deleted successfully (soft delete)" });
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
