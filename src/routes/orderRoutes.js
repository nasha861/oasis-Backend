const express = require("express");

const router = express.Router();

const {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");

const { protect } = require("../middleware/authMiddleware");

// Create an order
router.post("/", protect, createOrder);

// Get all orders
router.get("/", protect, getAllOrders);

// Get one order
router.get("/:id", protect, getOrderById);

// Update an order
router.put("/:id", protect, updateOrder);

// Delete an order
router.delete("/:id", protect, deleteOrder);

module.exports = router;