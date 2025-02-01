const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authMiddleware, roleMiddleware } = require('../middleware/auth.middleware');

// Tüm rotalar için authentication gerekli
router.use(authMiddleware);

// Kullanıcıları listele (admin ve restaurant_owner için)
router.get('/', roleMiddleware(['admin', 'restaurant_owner']), userController.getUsers);

// Personel listesi (restaurant_owner için)
router.get('/staff', roleMiddleware(['restaurant_owner']), userController.getStaff);

// Yeni kullanıcı oluştur (admin ve restaurant_owner için)
router.post('/', roleMiddleware(['admin', 'restaurant_owner']), userController.createUser);

// Kullanıcı güncelle (admin ve restaurant_owner için)
router.put('/:id', roleMiddleware(['admin', 'restaurant_owner']), userController.updateUser);

// Kullanıcı sil (admin ve restaurant_owner için)
router.delete('/:id', roleMiddleware(['admin', 'restaurant_owner']), userController.deleteUser);

module.exports = router;
