const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

// Public routes
router.post('/login', authController.login);

// Protected routes
router.use(authMiddleware);
router.get('/me', (req, res) => {
  res.json(req.user);
});

module.exports = router;
