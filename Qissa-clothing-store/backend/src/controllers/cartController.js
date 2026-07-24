import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

const POPULATE_FIELDS =
  "name slug price discountPrice images fabric brand";

const findCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  return cart;
};

const recalculateCart = async (cart) => {
  await cart.populate("items.product", POPULATE_FIELDS);

  cart.totalItems = cart.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  cart.subtotal = cart.items.reduce((sum, item) => {
    const price =
      item.product?.discountPrice || item.product?.price || 0;

    return sum + price * item.quantity;
  }, 0);

  return cart;
};

const saveAndRepopulate = async (cart) => {
  await cart.save();

  await cart.populate("items.product", POPULATE_FIELDS);

  return cart;
};

export const addToCart = async (req, res) => {
  try {
    const { product: productId, color, size, quantity } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    const variant = product.variants.find(
      (v) => v.color === color && v.size === size
    );

    if (!variant) {
      return res.status(400).json({
        success: false,
        message: "Selected colour and size combination is not available.",
      });
    }

    if (variant.stock <= 0) {
      return res.status(400).json({
        success: false,
        message: "Selected colour and size combination is currently out of stock.",
      });
    }

    const cart = await findCart(req.user.id);

    const existingItem = cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        item.color === color &&
        item.size === size
    );

    const newTotalQty = existingItem
      ? existingItem.quantity + quantity
      : quantity;

    if (newTotalQty > variant.stock) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock. Only ${variant.stock} available for ${color}, ${size}.`,
      });
    }

    if (existingItem) {
      existingItem.quantity = newTotalQty;
    } else {
      cart.items.push({ product: productId, color, size, quantity });
    }

    await recalculateCart(cart);

    await saveAndRepopulate(cart);

    res.status(200).json({
      success: true,
      message: "Item added to cart.",
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.product",
      POPULATE_FIELDS
    );

    if (!cart) {
      return res.status(200).json({
        success: true,
        data: {
          items: [],
          subtotal: 0,
          totalItems: 0,
        },
      });
    }

    const before = cart.items.length;

    cart.items = cart.items.filter((item) => item.product != null);

    if (cart.items.length !== before) {
      await recalculateCart(cart);
      await cart.save();
    }

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { color, size, quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found.",
      });
    }

    const item = cart.items.find(
      (i) =>
        i.product.toString() === productId &&
        i.color === color &&
        i.size === size
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart.",
      });
    }

    const product = await Product.findById(productId);

    if (product) {
      const variant = product.variants.find(
        (v) => v.color === color && v.size === size
      );

      if (variant && quantity > variant.stock) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock. Only ${variant.stock} available for ${color}, ${size}.`,
        });
      }
    }

    item.quantity = quantity;

    await recalculateCart(cart);

    await saveAndRepopulate(cart);

    res.status(200).json({
      success: true,
      message: "Quantity updated.",
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const removeItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { color, size } = req.body;

    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found.",
      });
    }

    const itemIndex = cart.items.findIndex(
      (i) =>
        i.product.toString() === productId &&
        i.color === color &&
        i.size === size
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart.",
      });
    }

    cart.items.splice(itemIndex, 1);

    await recalculateCart(cart);

    await saveAndRepopulate(cart);

    res.status(200).json({
      success: true,
      message: "Item removed from cart.",
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(200).json({
        success: true,
        message: "Cart is already empty.",
        data: { items: [], subtotal: 0, totalItems: 0 },
      });
    }

    cart.items = [];
    cart.subtotal = 0;
    cart.totalItems = 0;

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart cleared.",
      data: { items: [], subtotal: 0, totalItems: 0 },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
