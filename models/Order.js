import mongoose from "mongoose";

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const orderSchema = new Schema(
  {
    user: {
      type: ObjectId,
      ref: "user",
    },
    products: [
      {
        quantity: {
          type: Number,
          default: 1,
        },
        product: {
          type: ObjectId,
          ref: "product",
        },
      },
    ],
    email: {
      type: String,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.order || mongoose.model("order", orderSchema);
