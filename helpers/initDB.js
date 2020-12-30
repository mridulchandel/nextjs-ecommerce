import mongoose from "mongoose";

// HdDCv8lBJceNtzr4

function initDB() {
  if (mongoose.connections[0].readyState) {
    console.log("Already connected");
    return;
  }
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = mongoose.connection;
  db.on("connected", () => {
    console.log("connected to mongo");
  });
  db.on("error", (err) => {
    console.log("error connecting", err);
  });
}

export default initDB;
