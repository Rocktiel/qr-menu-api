const express = require("express");
const router = express.Router();
const {
  authMiddleware,
  roleMiddleware,
} = require("../middleware/auth.middleware");
const {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  toggleProductAvailability,
  getProductsForRestaurant,
} = require("../controllers/product.controller");

// Müşteri menüsü için ürünleri getir
router.get(
  "/restaurants/:restaurantId/categories/:categoryId",
  getProductsForRestaurant
);

// Tüm rotalar için authentication gerekli
router.use(authMiddleware);

// Ürün rotaları
router.post(
  "/categories/:categoryId/products",
  roleMiddleware(["admin", "restaurant_owner"]),
  createProduct
);

router.get("/categories/:categoryId/products", getProducts);
router.get("/products", getProducts);

router.put(
  "/products/:productId",
  roleMiddleware(["admin", "restaurant_owner"]),
  updateProduct
);

router.delete(
  "/products/:productId",
  roleMiddleware(["admin", "restaurant_owner"]),
  deleteProduct
);

router.patch(
  "/products/:productId/availability",
  roleMiddleware(["admin", "restaurant_owner"]),
  toggleProductAvailability
);

module.exports = router;
