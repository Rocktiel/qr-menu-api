const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurant.controller');
const { authMiddleware, isAdmin } = require('../middleware/auth.middleware');

// Tüm rotalar için authentication gerekli
router.use(authMiddleware);

// Admin rotaları
router.get('/', isAdmin, restaurantController.getAllRestaurants);
router.post('/', isAdmin, restaurantController.createRestaurant);
router.put('/:id', isAdmin, restaurantController.updateRestaurant);
router.delete('/:id', isAdmin, restaurantController.deleteRestaurant);
router.get('/:id', isAdmin, restaurantController.getRestaurantById);

module.exports = router;
