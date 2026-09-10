const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    // The customer who placed the order
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Products included in the order
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "SolarProduct",
          required: true,
        },

        name: {
          type: String,
          required: true,
        },

        price: {
          type: Number,
          required: true,
          min: 0,
        },

        quantity: {
          type: Number,
          required: true,
          min: 1,
        },

        subtotal: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],

    // Total amount for the entire order
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    // Customer delivery information
    customerInfo: {
      fullName: {
        type: String,
        required: true,
        trim: true,
      },

      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },

      phone: {
        type: String,
        required: true,
        trim: true,
      },

      deliveryAddress: {
        type: String,
        required: true,
        trim: true,
      },
    },

    // Order status
    status: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
    },

    // Payment status
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded"],
      default: "Pending",
    },

    // Later, when we add payment
    paymentMethod: {
      type: String,
      enum: ["Card", "Transfer", "Cash", "Wallet"],
      default: null,
    },

    transactionId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);