const Order = require("../models/Order");

// Create a new order
const createOrder = async (orderData) => {
  const order = await Order.create(orderData);

  return order;
};

// Get all orders
const getAllOrders = async () => {
  const orders = await Order.find()
    .populate("userId", "name email")
    .populate("items.productId");

  return orders;
};

// Get one order by ID
const getOrderById = async (orderId) => {
  const order = await Order.findById(orderId)
    .populate("userId", "name email")
    .populate("items.productId");

  return order;
};

// Update an order
const updateOrder = async (orderId, updateData) => {
  const order = await Order.findByIdAndUpdate(
    orderId,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );

  return order;
};

// Delete an order
const deleteOrder = async (orderId) => {
  const order = await Order.findByIdAndDelete(orderId);

  return order;
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
};