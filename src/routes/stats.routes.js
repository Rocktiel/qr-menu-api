const express = require("express");
const router = express.Router();
exports.router = router;
const statsController = require("../controllers/stats.controller");
const { authMiddleware } = require("../middleware/auth.middleware");

// Tüm rotalar için authentication gerekli
router.use(authMiddleware);

// İstatistikleri getir
router.get("/", statsController.getStats);

module.exports = router;
