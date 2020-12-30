import initDB from "../../../helpers/initDB";
import Product from "../../../models/Product";

initDB();

export default async (req, res) => {
  switch (req.method) {
    case "GET":
      await getProduct(req, res);
      break;

    case "DELETE":
      await deleteProduct(req, res);
      break;

    default:
      break;
  }
};

const getProduct = async (req, res) => {
  const {
    query: { pid },
  } = req;

  const product = await Product.findById(pid);
  res.status(200).json(product);
};

const deleteProduct = async (req, res) => {
  const {
    query: { pid },
  } = req;

  await Product.findByIdAndDelete(pid);
  res.status(200).json({});
};
