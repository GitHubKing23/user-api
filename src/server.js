const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");

// ✅ Load .env from root directory
const envFilePath = path.resolve(__dirname, "../.env");
dotenv.config({ path: envFilePath });

console.log("📦 Loaded .env file from:", envFilePath);
console.log("📂 File exists?", fs.existsSync(envFilePath));
console.log(" - PORT:", process.env.PORT);
console.log(" - MONGO_URI:", process.env.MONGO_URI ? "✅ Exists" : "❌ Missing");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ✅ Enhanced CORS Middleware
const allowedOrigins = [
  "http://localhost:3000",
  "https://sportifyinsider.com"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`❌ Blocked by CORS: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());

// ✅ Serve avatar uploads
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

// ✅ Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
  });

// ✅ Routes
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

// ✅ Health Check
app.get("/", (req, res) => {
  res.send("✅ User API is live!");
});

// ✅ Start Server
const PORT = process.env.PORT || 5002;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});
