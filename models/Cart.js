import mongoose from "mongoose";

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const cartSchema = new Schema({
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
});

export default mongoose.models.cart || mongoose.model("cart", cartSchema);
