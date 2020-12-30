import mongoose from "mongoose";

// HdDCv8lBJceNtzr4

function initDB() {
  if (mongoose.connections[0].readyState) {
    return;
  }
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = mongoose.connection;
  db.on("connected", () => {});
  db.on("error", (err) => {});
}

export default initDB;
