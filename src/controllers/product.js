// thêm bớt sửa xóa hiển thị
import Category from "../models/category";
import Product from "../models/product";
import { productSchema } from "../Schemas/product";

export const create = async (req, res) => {
  try {
    const { error } = productSchema.validate(req.body);
    if (error) {
      res.json({
        message: error.details[0].message,
      });
    }
    const product = await Product.create(req.body);
    await Category.findByIdAndUpdate(product.categoryId, {
      $addToSet: {
        products: product._id,
      },
    });
    return res.status(201).json({
      message: "Thêm sản phẩm thành công",
      product,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
export const getAll = async (req, res) => {
  // const { _sort = "createAt", _order = "asc", _limit = 10, _page = 1 } = req.query;

  // const options = {
  //     page: _page,
  //     limit: _limit,
  //     sort: {
  //         [_sort]: _order == "desc" ? -1 : 1,
  //     },
  // };
  try {
    // const { docs, totalDocs, totalPages } = await Product.paginate({}, options);
    // if(docs.length === 0) {
    //   return res.status(400).json({ message: "Không có sản phẩm nào" });
    // }
    const data = await Product.find();
    return res.status(200).json({
      message: "Danh sách",
      data,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const get = async (req, res) => {
  try {
    const data = await Product.findById(req.params.id).populate("categoryId");
    if (!data) {
      return res.status(400).json({
        message: "Không có sản phẩm nào",
      });
    }
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
    const { error } = productSchema.validate(req.body);
    if (error) {
      res.status(400).json({
        message: error.details[0].message,
      });
    }
    const idProduct = req.params.id;
    const productcu = await Product.findById(idProduct);
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    if (!product) {
      return res.status(400).json({
        message: "Cập nhập thất bại",
      });
    }
    const oldCategoryId = productcu.categoryId;
    await Category.findByIdAndUpdate(oldCategoryId, {
      $pull: { products: idProduct },
    });
    const newCategoryId = req.body.categoryId;
    if (newCategoryId) {
      await Category.findByIdAndUpdate(newCategoryId, {
        $addToSet: { products: idProduct },
      });
    }
    return res.json({
      message: "Sửa sản phẩm thành công",
      product,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
export const remove = async (req, res) => {
  try {
    const id = req.params.id;
    const { isHardDelete } = req.body;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(400).json({
        message: "Không có sản phẩm nào",
      });
    }
    await product.deleteOne();

    await Category.findByIdAndUpdate(product.categoryId, {
      $pull: { products: product._id },
    });
    // const product = await Product.findOneAndRemove({ _id: req.params.id });
    return res.json({
      message: "Xóa sản phẩm thành công",
      product,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
