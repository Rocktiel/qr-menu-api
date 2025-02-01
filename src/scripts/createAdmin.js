require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User } = require('../models');

async function createAdmin() {
  try {
    await sequelize.authenticate();
    console.log('Veritabanı bağlantısı başarılı.');

    const adminData = {
      username: 'admin',
      password: await bcrypt.hash('admin123', 10),
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      isActive: true
    };

    const admin = await User.create(adminData);
    console.log('Admin kullanıcısı başarıyla oluşturuldu:', admin.username);
    
    process.exit(0);
  } catch (error) {
    console.error('Hata:', error);
    process.exit(1);
  }
}

createAdmin();
