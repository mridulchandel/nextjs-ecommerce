import jwt from "jsonwebtoken";

export default function Authenticated(Component) {
  return (req, res) => {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).json({ error: "You must login." });
    }
    try {
      const { userId } = jwt.verify(authorization, process.env.JWT_SECRET);
      req.userId = userId;
      return Component(req, res);
    } catch (err) {
      console.log(err, "Error while fetching cart");
      return res.status(401).json({ error: "You must login." });
    }
  };
}
