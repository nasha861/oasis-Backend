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
const { authorize } = require("../middleware/roleMiddleware");

router.post("/", protect, createOrder);

router.get("/", protect, getAllOrders);

router.get("/:id", protect, getOrderById);

router.put("/:id", protect, authorize("admin"), updateOrder);

router.delete("/:id", protect, authorize("admin"), deleteOrder);

module.exports = router;