const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const {
  authMiddleware,
  roleMiddleware,
} = require("../middleware/auth.middleware");

// Müşteri menüsü için kategorileri getir
router.get(
  "/restaurants/:restaurantId",
  categoryController.getCategoriesForRestaurant
);

router.use(authMiddleware);
router.use(roleMiddleware(["restaurant_owner"]));

// Kategori listesi
router.get("/", categoryController.getCategories);

// Yeni kategori oluştur
router.post("/", categoryController.createCategory);

// Kategori güncelle
router.put("/:id", categoryController.updateCategory);

// Kategori sil
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
