import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        type: mongoose.ObjectId,
        ref: "Products",
      },
    ],
    payment: {},
    buyer: {
      type: mongoose.ObjectId,
      ref: "users",
    },
    status: {
      type: String,
      default: "No procesado",
      enum: ["No procesado", "Procesando", 
      "Enviado", "Entregado", "Cancelado"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
