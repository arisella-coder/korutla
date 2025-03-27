import mongoose from "mongoose";
import {
  Product,
  Category,
  SubCategory,
  Unit,
} from "../models/products/productsModel.js";
import { Vendor } from "../models/users/usersModel.js";
import { createDocument, findDocuments } from "../utils/dbUtils.js";

export async function createCategory(req, res) {
  try {
    const { name, description } = req.body;
    const category = await createDocument(Category, { name, description });
    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function getCategories(req, res) {
  try {
    const categories = await findDocuments(Category);
    res.status(201).json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function createSubCategory(req, res) {
  try {
    const { category } = req.params;
    const { name } = req.body;

    // Create and save the new subcategory
    const subCategory = new SubCategory({ name, description, category });
    await subCategory.save();

    res.status(201).json(subCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function getSubCategories(req, res) {
  try {
    const { category } = req.params;
    const subCategories = await SubCategory.find({ category });
    res.json(subCategories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function createUnit(req, res) {
  try {
    const { name, description } = req.body;
    const unit = new Unit({ name, description });
    await unit.save();
    res.status(201).json(unit);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function getUnits(req, res) {
  try {
    const units = await Unit.find();
    res.json(units);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function createProduct(req, res) {
  try {
    const { name, price, category, subcategory, quantity, unit, stock } =
      req.body;
    if (!name) {
      return res.status(400).json({ message: "Product name is required." });
    }
    if (!price) {
      return res.status(400).json({ message: "Product price is required." });
    }
    if (!category) {
      return res.status(400).json({ message: "Category is required." });
    }
    if (!subcategory) {
      return res.status(400).json({ message: "Subcategory is required." });
    }
    if (!quantity) {
      return res.status(400).json({ message: "Quantity is required." });
    }
    if (!unit) {
      return res.status(400).json({ message: "Unit is required." });
    }
    if (!stock) {
      return res.status(400).json({ message: "Stock is required." });
    }

    // Validate category and subcategory as valid ObjectIds
    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ message: "Invalid category ID." });
    }
    if (!mongoose.Types.ObjectId.isValid(subcategory)) {
      return res.status(400).json({ message: "Invalid subcategory ID." });
    }
    if (!mongoose.Types.ObjectId.isValid(unit)) {
      return res.status(400).json({ message: "Invalid subcategory ID." });
    }

    // Check if the category exists
    const categoryDoc = await Category.findById(category);
    if (!categoryDoc) {
      return res.status(404).json({ message: "Category not found." });
    }

    // Check if the subcategory exists and belongs to the provided category
    const subCategoryDoc = await SubCategory.findOne({
      _id: subcategory,
      category,
    });
    if (!subCategoryDoc) {
      return res
        .status(404)
        .json({ message: "Subcategory not found for the provided category." });
    }
    const units = await Unit.findById(unit);
    if (!units) {
      return res.status(404).json({ message: "Unit not found." });
    }
    const productExist = await Product.findOne({ name: name });
    if (productExist) {
      return res.status(400).json({ message: "Product already exists." });
    }
    const productData = { ...req.body, vendor: req.user.id };
    const product = new Product(productData);
    await product.save();
    await Vendor.findByIdAndUpdate(req.user.id, {
      $push: { products: product._id },
    });
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function getProducts(req, res) {
  try {
    // Parse page and limit from query parameters; default to page 1 and limit 10 if not provided
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const searchTerm = req.query.search || "";

    // Build a filter object
    const filter = {
      vendor: req.user.id,
    };

    // If there's a search term, filter by name (case-insensitive)
    if (searchTerm) {
      filter.name = { $regex: searchTerm, $options: "i" };
    }

    // Get products for the authenticated vendor with pagination
    const productsPromise = Product.find(filter).skip(skip).limit(limit);

    // Count total products for the vendor
    const totalPromise = Product.countDocuments({ vendor: req.user.id });

    // Count online products
    const onlineCountPromise = Product.countDocuments({
      vendor: req.user.id,
      online: true,
    });

    const [products, total, onlineCount] = await Promise.all([
      productsPromise,
      totalPromise,
      onlineCountPromise,
    ]);

    const offlineCount = total - onlineCount;

    res.json({
      products,
      total,
      onlineCount,
      offlineCount,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function getProductById(req, res) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function updateProduct(req, res) {
  try {
    // Attempt to find and update the product by matching both the product ID and the vendor ID
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, vendor: req.user.id },
      req.body,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        message:
          "Product not found or you do not have permission to edit this product",
      });
    }
    res.status(200).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
