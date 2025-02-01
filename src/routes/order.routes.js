const express = require("express");
const router = express.Router();
const {
  authMiddleware,
  roleMiddleware,
} = require("../middleware/auth.middleware");
const {
  createOrder,
  getActiveOrders,
  updateOrderStatus,
  getOrderHistory,
} = require("../controllers/order.controller");

// Müşteri siparişi oluşturma (auth gerektirmez)
router.post("/", createOrder);

// Restoran personeli için rotalar
router.use(authMiddleware);
router.use(roleMiddleware(["admin", "restaurant_owner", "staff"]));

// Aktif siparişleri getir
router.get("/restaurants/:restaurantId/active", getActiveOrders);

// Sipariş geçmişi
router.get("/restaurants/:restaurantId/history", getOrderHistory);

// Sipariş durumunu güncelle
router.patch("/:orderId/status", updateOrderStatus);

module.exports = router;
