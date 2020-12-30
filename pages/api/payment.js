import Stripe from "stripe";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

import Cart from "../../models/Cart";
import Order from "../../models/Order";
import initDB from "../../helpers/initDB";

initDB();

const stripe = new Stripe(process.env.STRIPE_SECRET);

export default async (req, res) => {
  const { paymentInfo } = req.body;
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: "You must login" });
  }
  try {
    const { userId } = jwt.verify(authorization, process.env.JWT_SECRET);
    const cart = await Cart.findOne({ user: userId }).populate(
      "products.product"
    );
    let total = 0;

    cart.products.forEach((item) => {
      total += item.product.price * item.quantity;
    });

    const prevCustomer = await stripe.customers.list({
      email: paymentInfo.email,
    });

    const isExistingCustomer = prevCustomer.data.length > 0;

    let newCustomer;
    if (!isExistingCustomer) {
      newCustomer = await stripe.customers.create({
        email: paymentInfo.email,
        source: paymentInfo.id,
      });
    }

    const charge = await stripe.charges.create(
      {
        amount: total * 100,
        currency: "INR",
        receipt_email: paymentInfo.email,
        customer: isExistingCustomer ? prevCustomer.data[0].id : newCustomer.id,
        description: `You purchased a product | ${paymentInfo.email}`,
      },
      {
        idempotencyKey: uuidv4(),
      }
    );

    await new Order({
      user: userId,
      products: cart.products,
      email: paymentInfo.email,
      total,
    }).save();

    await Cart.findOneAndUpdate({ _id: cart._id }, { $set: { products: [] } });

    res.status(200).json({ message: "Payment successful" });
  } catch (err) {
    console.log(err, "Error while fetching cart");
    return res.status(401).json({ error: "Error processing payment" });
  }
};
