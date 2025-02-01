const express = require("express");
const router = express.Router();
const {
  authMiddleware,
  roleMiddleware,
} = require("../middleware/auth.middleware");
const {
  createTable,
  getTables,
  updateTable,
  deleteTable,
  getTablesWithActiveOrders,
} = require("../controllers/table.controller");

// Tüm rotalar için authentication gerekli
router.use(authMiddleware);

// Restoran sahibi ve personel rotaları
router.post(
  "/restaurants/:restaurantId/tables",
  roleMiddleware(["admin", "restaurant_owner"]),
  createTable
);
router.get("/restaurants/:restaurantId/tables", getTables);
router.put(
  "/restaurants/:tableId/tables",
  roleMiddleware(["admin", "restaurant_owner"]),
  updateTable
);
router.delete(
  "/tables/:tableId",
  roleMiddleware(["admin", "restaurant_owner"]),
  deleteTable
);

router.get(
  "/restaurants/:restaurantId/with-orders",
  roleMiddleware(["admin", "restaurant_owner", "staff"]),
  getTablesWithActiveOrders
);

module.exports = router;
