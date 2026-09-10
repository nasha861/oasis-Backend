const Order = require("../models/Order");

const { initializePayment, verifyPayment } = require("../services/paystackService");

// Verify Paystack payment
const verifyPaystackPayment = async (req, res) => {
  try {
    const { reference, orderId } = req.body;

    if (!reference || !orderId) {
      return res.status(400).json({
        success: false,
        message: "Payment reference and order ID are required",
      });
    }

    // Find the order
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Make sure the order belongs to the logged-in user
    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to verify this order",
      });
    }

    // Ask Paystack to verify the transaction
    const payment = await verifyPayment(reference);

    if (
      !payment.status ||
      payment.data.status !== "success"
    ) {
      order.paymentStatus = "Failed";
      await order.save();

      return res.status(400).json({
        success: false,
        message: "Payment was not successful",
        data: payment.data,
      });
    }

    // Make sure the amount paid matches the order amount
    const paidAmount = payment.data.amount;
    const expectedAmount = Math.round(order.totalAmount * 100);

    if (paidAmount !== expectedAmount) {
      return res.status(400).json({
        success: false,
        message: "Payment amount does not match order amount",
      });
    }

    // Payment is valid
    order.paymentStatus = "Paid";
    order.paymentMethod = "Card";
    order.transactionId = reference;

    await order.save();

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      data: order,
    });
  } catch (error) {
    console.error("Paystack Verification Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to verify payment",
      error: error.message,
    });
  }
};

const createPayment = async (req, res) => {
  try {
    const { orderId, paymentMethod } = req.body;

    if (!orderId || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "Order ID and payment method are required",
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Make sure the order belongs to the logged-in user
    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to pay for this order",
      });
    }

    order.paymentMethod = paymentMethod;
    order.paymentStatus = "Pending";

    await order.save();

    res.status(201).json({
      success: true,
      message: "Payment initiated successfully",
      data: order,
    });
  } catch (error) {
    console.error("Create Payment Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to initiate payment",
      error: error.message,
    });
  }
};


// Initialize Paystack payment
// Initialize Paystack payment
const initializePaystackPayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    // Find the order
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Make sure the order belongs to the logged-in user
    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to pay for this order",
      });
    }

    // Prevent paying for an already paid order
    if (order.paymentStatus === "Paid") {
      return res.status(400).json({
        success: false,
        message: "This order has already been paid for",
      });
    }

    // Generate a unique Paystack reference
    const reference = `OASIS-${order._id}-${Date.now()}`;

    // Initialize payment with Paystack
    const payment = await initializePayment({
      email: order.customerInfo.email,
      amount: order.totalAmount,
      reference,
    });

    // Save payment information to the order
    order.paymentMethod = "Card";
    order.paymentStatus = "Pending";
    order.transactionId = reference;

    await order.save();

    res.status(200).json({
      success: true,
      message: "Payment initialized successfully",
      data: {
        orderId: order._id,
        reference: reference,
        authorization_url: payment.data.authorization_url,
        access_code: payment.data.access_code,
      },
    });
  } catch (error) {
    console.error("Paystack Initialization Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to initialize Paystack payment",
      error: error.message,
    });
  }
};


module.exports = {
  createPayment,
  initializePaystackPayment,
  verifyPaystackPayment,
};