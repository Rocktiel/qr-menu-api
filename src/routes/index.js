const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const restaurantRoutes = require('./restaurant.routes');

// Routes
router.use('/auth', authRoutes);
router.use('/restaurants', restaurantRoutes);

module.exports = router;
