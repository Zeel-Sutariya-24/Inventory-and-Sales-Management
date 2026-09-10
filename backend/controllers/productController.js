const Product = require("../models/Product");
const { productSchema } = require("../src/validators/productValidator");


// CREATE PRODUCT
const createProduct = async (req, res) => {
  try {
    const result = productSchema.parse(req.body);

    const product = await Product.create(result);

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error(error);

    if (error.name === "ZodError") {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.flatten().fieldErrors,
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        message: "SKU already exists",
      });
    }

    res.status(500).json({
      message: "Failed to create product",
    });
  }
};


// GET PRODUCTS
const getProducts = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 5 } = req.query;

    const currentPage = Number(page);
    const currentLimit = Number(limit);

    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { sku: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * currentLimit)
      .limit(currentLimit);

    const total = await Product.countDocuments(query);

    res.json({
      products,
      pagination: {
        page: currentPage,
        limit: currentLimit,
        total,
        totalPages: Math.ceil(total / currentLimit),
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch products",
    });
  }
};

// GET PRODUCT BY ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
      product,
    });
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: "Invalid product ID",
    });
  }
};


// UPDATE PRODUCT
const updateProduct = async (req, res) => {
  try {
    const result = productSchema.parse(req.body);

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      result,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error(error);

    if (error.name === "ZodError") {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.flatten().fieldErrors,
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        message: "SKU already exists",
      });
    }

    res.status(500).json({
      message: "Failed to update product",
    });
  }
};


// DELETE PRODUCT
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: "Invalid product ID",
    });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};