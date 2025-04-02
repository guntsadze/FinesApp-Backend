import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config"; // ✅
import policeFinesRoutes from "./src/routes/policeFinesRoutes.js";
import parkingFinesRoute from "./src/routes/parkingFinesRoute.js";

const app = express();

app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MongoDB URI is missing!");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

app.use("/api", parkingFinesRoute);
app.use("/api", policeFinesRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
