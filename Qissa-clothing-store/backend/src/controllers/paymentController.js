import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Address from "../models/Address.js";
import Order from "../models/Order.js";
import stripe from "../config/stripe.js";
import { createOrderFromCart } from "../services/orderService.js";

const POPULATE_FIELDS =
  "name slug price discountPrice images fabric brand isActive variants";
const SHIPPING_COST = 200;

/**
 * Create a Stripe Checkout Session.
 * Reads the authenticated user's cart, validates every item,
 * converts them into Stripe line_items, includes shipping,
 * and returns the Stripe session URL for frontend redirect.
 *
 * Does NOT create an order, decrease stock, or clear the cart.
 * Order creation happens after the Stripe webhook confirms payment.
 */
export const createCheckoutSession = async (req, res) => {
  try {
    // ---------------------------------------------------------------
    // 1. Fetch and populate the user's cart
    // ---------------------------------------------------------------
    const cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.product",
      POPULATE_FIELDS
    );

    if (!cart) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty.",
      });
    }

    if (cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty.",
      });
    }

    // ---------------------------------------------------------------
    // 2. Validate every cart item (product exists, active, variant, stock)
    // ---------------------------------------------------------------
    const lineItems = [];
    const errors = [];

    for (const cartItem of cart.items) {
      const product = cartItem.product;

      // Product must exist and be active
      if (!product || !product.isActive) {
        errors.push(
          `"${product?.name || "Unknown"}" is no longer available.`
        );
        continue;
      }

      // Selected variant (color + size) must exist on the product
      const variant = product.variants.find(
        (v) => v.color === cartItem.color && v.size === cartItem.size
      );

      if (!variant) {
        errors.push(
          `Variant (${cartItem.color}, ${cartItem.size}) is no longer available for ${product.name}.`
        );
        continue;
      }

      // Must have enough stock to fulfill the order
      if (variant.stock < cartItem.quantity) {
        errors.push(
          `Insufficient stock for ${product.name} (${cartItem.color}, ${cartItem.size}). Available: ${variant.stock}, requested: ${cartItem.quantity}.`
        );
        continue;
      }

      // ---------------------------------------------------------------
      // 3. Build Stripe line_item for this cart item
      // ---------------------------------------------------------------
      const effectivePrice = product.discountPrice || product.price;

      /**
       * Stripe expects amounts in the smallest currency unit.
       * PKR uses 2 decimal places (1 PKR = 100 paisa).
       * Rs. 200 → unit_amount: 20000
       */
      const unitAmount = Math.round(effectivePrice * 100);

      // Stripe requires publicly accessible HTTPS image URLs.
      // Our product images are stored as local frontend assets
      // (e.g. "/assets/images/clothes/..."), so we omit them for now.
      // In production, upload product images to a CDN / S3 and pass the URL here.

      lineItems.push({
        price_data: {
          currency: "pkr",
          product_data: {
            name: product.name,
          },
          unit_amount: unitAmount,
        },
        quantity: cartItem.quantity,
      });
    }

    // Return all validation errors at once (like order checkout does)
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Some items could not be processed.",
        errors,
      });
    }

    if (lineItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid items to checkout.",
      });
    }

    // ---------------------------------------------------------------
    // 4. Add shipping as a separate line item
    // ---------------------------------------------------------------
    lineItems.push({
      price_data: {
        currency: "pkr",
        product_data: {
          name: "Shipping",
        },
        unit_amount: SHIPPING_COST * 100, // Rs. 200 → 20000
      },
      quantity: 1,
    });

    // ---------------------------------------------------------------
    // 5. Validate shipping address
    // ---------------------------------------------------------------
    const { addressId } = req.body;

    if (!addressId) {
      return res.status(400).json({
        success: false,
        message: "Shipping address is required.",
      });
    }

    const address = await Address.findOne({
      _id: addressId,
      user: req.user.id,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found.",
      });
    }

    // ---------------------------------------------------------------
    // 6. Log session creation inputs for debugging
    // ---------------------------------------------------------------
    const successUrl =
      "http://localhost:5173/payment/success?session_id={CHECKOUT_SESSION_ID}";
    const cancelUrl = "http://localhost:5173/payment/cancel";

    console.log("[Stripe Debug] success_url:", successUrl);
    console.log("[Stripe Debug] cancel_url:", cancelUrl);
    console.log(
      "[Stripe Debug] line_items:",
      JSON.stringify(lineItems, null, 2)
    );

    // ---------------------------------------------------------------
    // 7. Create the Stripe Checkout Session
    // ---------------------------------------------------------------
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      client_reference_id: req.user.id,
      metadata: {
        userId: req.user.id,
        addressId,
        paymentMethod: "Stripe",
        source: "Qissa",
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    // ---------------------------------------------------------------
    // 8. Return the session to the frontend
    // ---------------------------------------------------------------
    res.status(200).json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error("[Stripe Error] Full error object:", error);
    console.error("[Stripe Error] type:", error.type);
    console.error("[Stripe Error] code:", error.code);
    console.error("[Stripe Error] param:", error.param);
    console.error("[Stripe Error] message:", error.message);
    if (error.raw) {
      console.error("[Stripe Error] raw:", JSON.stringify(error.raw, null, 2));
    }
    if (error.detail) {
      console.error("[Stripe Error] detail:", error.detail);
    }

    // Forward the most descriptive message available
    const message = error.raw?.message || error.message || "Stripe error";
    res.status(500).json({
      success: false,
      message,
    });
  }
};

/**
 * Stripe webhook handler.
 * Expects the raw request body (use express.raw middleware in the route).
 * Processes events such as checkout.session.completed and
 * payment_intent.succeeded to update order payment status.
 */
export const stripeWebhook = async (req, res) => {
  let event;

  // ------------------------------------------------------------------
  // 1. Verify Stripe signature
  // ------------------------------------------------------------------
  try {
    const sig = req.headers["stripe-signature"];
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error.message);
    return res.status(400).json({
      success: false,
      message: "Webhook signature verification failed.",
    });
  }

  console.log("Stripe Event:", event.type);

  // ------------------------------------------------------------------
  // 2. Only handle checkout.session.completed
  // ------------------------------------------------------------------
  if (event.type !== "checkout.session.completed") {
    return res.status(200).json({ received: true });
  }

  const session = event.data.object;

  console.log("Session ID:", session.id);
  console.log("User ID:", session.metadata.userId);
  console.log("Address ID:", session.metadata.addressId);

  // ------------------------------------------------------------------
  // 3. Idempotency — prevent duplicate orders
  // ------------------------------------------------------------------
  const existingOrder = await Order.findOne({ stripeSessionId: session.id });
  if (existingOrder) {
    console.log("Duplicate webhook — order already exists for session:", session.id);
    return res.status(200).json({ received: true });
  }

  // ------------------------------------------------------------------
  // 4. Fetch address and build snapshot
  // ------------------------------------------------------------------
  const address = await Address.findById(session.metadata.addressId);
  if (!address) {
    console.error("Address not found for ID:", session.metadata.addressId);
    return res.status(400).json({
      success: false,
      message: "Shipping address not found.",
    });
  }

  const addressSnapshot = {
    fullName: address.fullName,
    phone: address.phone,
    country: address.country,
    provinceState: address.provinceState,
    city: address.city,
    postalCode: address.postalCode,
    streetAddress: address.streetAddress,
    landmark: address.landmark,
    addressType: address.addressType,
  };

  // ------------------------------------------------------------------
  // 5. Create order via service
  // ------------------------------------------------------------------
  try {
    await createOrderFromCart({
      userId: session.metadata.userId,
      addressSnapshot,
      paymentMethod: "Stripe",
      paymentStatus: "Paid",
      stripeSessionId: session.id,
      stripePaymentIntent: session.payment_intent,
    });

    console.log("Order successfully created for session:", session.id);
  } catch (error) {
    console.error("Order creation failed:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }

  res.status(200).json({ received: true });
};

/**
 * Verify an existing payment by Stripe session ID.
 * Retrieves the session from Stripe and returns its status / payment status.
 */
export const verifyPayment = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    res.status(200).json({
      success: true,
      data: {
        sessionId: session.id,
        paymentStatus: session.payment_status,
        status: session.status,
        paymentIntent: session.payment_intent,
        amountTotal: session.amount_total,
        currency: session.currency,
        customerEmail: session.customer_details?.email || null,
        metadata: session.metadata,
        created: session.created,
      },
    });
  } catch (error) {
    if (error.type === "StripeInvalidRequestError") {
      return res.status(400).json({
        success: false,
        message: "Invalid Stripe session.",
      });
    }

    console.error("Payment verification failed:", error.message);
    res.status(500).json({
      success: false,
      message: "Payment verification failed.",
    });
  }
};
