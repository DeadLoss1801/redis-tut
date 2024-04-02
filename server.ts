import express from "express";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes";
import { client } from "./config/connect";
import cors from "cors";
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

// Middleware to log cache status
// app.use((req, res, next) => {
//   res.on("finish", () => {
//     const cached = res.getHeader("X-Cached");
//     console.log(`Cached: ${cached}`);
//   });
//   next();
// });

// MongoDB setup
mongoose
  .connect(
    "mongodb+srv://arpitverma2410:sheela2005@cluster0.espfs10.mongodb.net/"
  )
  .then(() => console.log("Connected to database"))
  .catch((err) => console.log("Connection failed:", err)); // Add error handling

// Routes
app.use("/users", userRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
