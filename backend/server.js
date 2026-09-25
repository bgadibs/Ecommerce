const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();



app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const orderRoutes = require("./routes/orderRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const userRoutes = require("./routes/userRoutes");
const profileRoutes = require("./routes/profileRoutes");
const superAdminRoutes =require("./routes/superAdminRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

app.get("/api/test", (req, res) => {
    res.json({
        message: "API route is working"
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/users", userRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/superadmin",superAdminRoutes);
app.use("/api/dashboard", dashboardRoutes);

const PORT = process.env.PORT || 5000;
const path = require("path");
const frontendPath = path.join(__dirname, "..", "frontend", "dist");
// redirect: false stops /products being redirected to /products/
// (public/products holds the product images and shares the route's name)
app.use(express.static(frontendPath, { redirect: false }));
app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});