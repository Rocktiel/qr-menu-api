require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models");
const { createAdmin } = require("./controllers/auth.controller");

const app = express();

// CORS ayarları
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.use(express.json());

// Routes
const authRoutes = require("./routes/auth.routes");
const restaurantRoutes = require("./routes/restaurant.routes");
const userRoutes = require("./routes/user.routes");
const statsRoutes = require("./routes/stats.routes");
const tableRoutes = require("./routes/table.routes");
const categoryRoutes = require("./routes/category.routes");
const productRoutes = require("./routes/product.routes");
const orderRoutes = require("./routes/order.routes");

app.use("/api/auth", authRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/users", userRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/tables", tableRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

const PORT = process.env.PORT || 3001;

const startServer = async () => {
  try {
    await sequelize.sync({ force: true });
    // console.log("Veritabanı başarıyla senkronize edildi.");

    await createAdmin();

    app.listen(PORT, () => {
      console.log(`Sunucu ${PORT} portunda çalışıyor`);
    });
  } catch (error) {
    console.error("Unable to start server:", error);
  }
};

startServer();
