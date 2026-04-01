import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        type: Object, // or mongoose.ObjectId
        // ref: "Product",
      },
    ],
    total: Number,
    charge: {
      type: Number,
      default: 0,
    },
    user: {
      type: Object, // or mongoose.ObjectId
      // ref: "Product",
    },
    status: {
      type: String,
      default: "Not Process",
      enum: ["Not Process", "Processing", "shipped", "delivered", "cancelled"],
    },
  },
  { timestamps: true }
);

export const OrderModel =
  mongoose.models?.Order || mongoose.model("Order", orderSchema);
