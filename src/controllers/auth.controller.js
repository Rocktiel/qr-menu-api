const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Restaurant } = require('../models');

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Login attempt with:', { username, password });

    // Kullanıcıyı bul
    const user = await User.findOne({
      where: { username },
      include: [{
        model: Restaurant,
        as: 'restaurant',
        attributes: ['id', 'name']
      }]
    });

    console.log('Found user:', user ? user.username : 'not found');

    if (!user) {
      return res.status(401).json({ message: 'Geçersiz kullanıcı adı veya şifre' });
    }

    // Kullanıcı aktif değilse giriş yapamaz
    if (!user.isActive) {
      return res.status(403).json({ message: 'Hesabınız pasif durumdadır. Lütfen yönetici ile iletişime geçin.' });
    }

    // Şifreyi kontrol et
    const validPassword = await bcrypt.compare(password, user.password);
    console.log('Password valid:', validPassword);

    if (!validPassword) {
      return res.status(401).json({ message: 'Geçersiz kullanıcı adı veya şifre' });
    }

    // Token oluştur
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
        restaurantId: user.restaurantId
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Login successful, sending response');

    // Kullanıcı bilgilerini gönder (şifre hariç)
    const { password: _, ...userWithoutPassword } = user.toJSON();
    res.json({
      token,
      user: userWithoutPassword
    });
    
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ message: 'Giriş yapılırken bir hata oluştu' });
  }
};

const createAdmin = async () => {
  try {
    const adminExists = await User.findOne({ where: { username: 'admin' } });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('123456', 10);
      await User.create({
        username: 'admin',
        password: hashedPassword,
        email: 'admin@example.com',
        role: 'admin',
        name: 'Admin',
        isActive: true
      });
      console.log('Admin user created successfully');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};

module.exports = {
  login,
  createAdmin
};
