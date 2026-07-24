import mongoose from "mongoose";

const variantSchema = new mongoose.Schema(
  {
    color: {
      type: String,
      required: true,
      trim: true,
    },

    size: {
      type: String,
      required: true,
      trim: true,
    },

    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
  },
  {
    _id: false,
  }
);

const imageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },

    alt: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    _id: false,
  }
);

const productSchema = new mongoose.Schema(
  {
    // Product Name
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // SEO Friendly URL
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // Description
    description: {
      type: String,
      required: true,
      trim: true,
    },

    // Original Price
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    // Discounted Price
    discountPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Category
    category: {
      type: String,
      required: true,
      trim: true,
    },

    // Sub Category
    subCategory: {
      type: String,
      trim: true,
    },

    // Brand
    brand: {
      type: String,
      default: "Qissa",
      trim: true,
    },

    // Fabric
    fabric: {
      type: String,
      trim: true,
    },

    // Product Images
    images: {
      type: [imageSchema],
      default: [],
    },

    // Variants (Color + Size + Stock)
    variants: {
      type: [variantSchema],
      default: [],
    },

    // Average Rating
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    // Number of Reviews
    numReviews: {
      type: Number,
      default: 0,
    },

    // Featured Product
    isFeatured: {
      type: Boolean,
      default: false,
    },

    // New Arrival
    isNewArrival: {
      type: Boolean,
      default: false,
    },

    // Product Visibility
    isActive: {
      type: Boolean,
      default: true,
    },

    // Search Tags
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;