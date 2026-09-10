const express = require("express");

const router = express.Router();

const {
  createPayment,
  initializePaystackPayment,
  verifyPaystackPayment,
} = require("../controllers/paymentController");

const { protect } = require("../middleware/authMiddleware");


// Existing payment route
router.post("/", protect, createPayment);


// Initialize Paystack payment
router.post(
  "/paystack/initialize",
  protect,
  initializePaystackPayment
);


// Verify Paystack payment
router.post(
  "/paystack/verify",
  protect,
  verifyPaystackPayment
);


module.exports = router;