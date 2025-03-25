import { Product } from "../models/products/productsModel.js";
import { Vendor } from "../models/users/usersModel.js";

export async function createProduct(req, res) {
  try {
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
    const productsPromise = Product.find(filter)
      .skip(skip)
      .limit(limit);

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
