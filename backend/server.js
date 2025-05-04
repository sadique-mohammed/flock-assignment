import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectToDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();
connectToDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.get("/", (req, res) => {
  res.send("API is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
