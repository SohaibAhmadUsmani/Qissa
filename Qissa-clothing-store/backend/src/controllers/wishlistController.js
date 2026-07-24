import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";

const POPULATE_FIELDS =
  "name slug price discountPrice images fabric brand rating numReviews";

const findWishlist = async (userId) => {
  let wishlist = await Wishlist.findOne({ user: userId });

  if (!wishlist) {
    wishlist = await Wishlist.create({ user: userId, products: [] });
  }

  return wishlist;
};

export const addToWishlist = async (req, res) => {
  try {
    const { product } = req.body;

    const existingProduct = await Product.findById(product);

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    const wishlist = await findWishlist(req.user.id);

    if (wishlist.products.includes(product)) {
      return res.status(409).json({
        success: false,
        message: "Product already in wishlist.",
      });
    }

    wishlist.products.push(product);

    await wishlist.save();

    await wishlist.populate("products", POPULATE_FIELDS);

    res.status(200).json({
      success: true,
      message: "Product added to wishlist.",
      data: wishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({
      user: req.user.id,
    }).populate("products", POPULATE_FIELDS);

    if (!wishlist) {
      return res.status(200).json({
        success: true,
        data: { products: [] },
      });
    }

    res.status(200).json({
      success: true,
      data: wishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found.",
      });
    }

    const index = wishlist.products.indexOf(productId);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not found in wishlist.",
      });
    }

    wishlist.products.splice(index, 1);

    await wishlist.save();

    await wishlist.populate("products", POPULATE_FIELDS);

    res.status(200).json({
      success: true,
      message: "Product removed from wishlist.",
      data: wishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const clearWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      return res.status(200).json({
        success: true,
        message: "Wishlist is already empty.",
        data: { products: [] },
      });
    }

    wishlist.products = [];

    await wishlist.save();

    res.status(200).json({
      success: true,
      message: "Wishlist cleared.",
      data: { products: [] },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
