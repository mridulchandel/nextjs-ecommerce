import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import initDB from "../../helpers/initDB";
import User from "../../models/User";

initDB();

export default async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(422).json({ error: "Please fill all the fields" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ error: "User doesn't exists with that email" });
    }
    const doMatch = await bcrypt.compare(password, user.password);

    if (doMatch) {
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      const { name, email, role } = user;
      res.status(201).json({ token, user: { name, email, role } });
    } else {
      return res
        .status(401)
        .json({ error: "Email or Password doesn't match." });
    }

    res.status(201).json({ message: "Signup Successful" });
  } catch (err) {}
};
