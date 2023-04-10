// thêm bớt sửa xóa hiển thị
import Category from "./../models/category";
import Product from "./../models/product";
import { categorySchema } from "../Schemas/category";
export const create = async (req, res) => {
  try {
    const { error } = categorySchema.validate(req.body);
    if (error) {
      res.json({
        message: error.details[0].message,
      });
    }
    const category = await Category.create(req.body);
    return res.status(201).json({
      message: "Thêm danh mục thành công",
      category,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const get = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate(
      "products"
    );
    if (!category) {
      return res.status(400).json({
        message: "Không có danh mục nào",
      });
    }
    const product = await Product.find({ categoryId: req.params.id });

    return res.status(201).json(category);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
export const getAll = async (req, res) => {
  try {
    const data = await Category.find();
    return res.status(201).json({
      message: "Danh sách",
      data,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
export const update = async (req, res) => {
  try {
    const { error } = categorySchema.validate(req.body);
    if (error) {
      res.status(400).
        json({
          message: error.details[0].message,
        });
    }
    const category = await Category.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    return res.json({
      message: "Sửa danh mục thành công",
      category,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
export const remove = async (req, res) => {
  try {
    const category = await Category.findOneAndRemove({ _id: req.params.id });
    return res.json({
      message: "Xóa danh mục thành công",
      category,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
