const { Restaurant, User } = require('../models');

const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.findAll();
    res.json(restaurants);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ message: 'Restoranlar getirilirken bir hata oluştu' });
  }
};

const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByPk(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restoran bulunamadı' });
    }
    res.json(restaurant);
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    res.status(500).json({ message: 'Restoran getirilirken bir hata oluştu' });
  }
};

const createRestaurant = async (req, res) => {
  try {
    console.log('Creating restaurant with data:', req.body);
    const { name, address, phone } = req.body;

    if (!name || !address || !phone) {
      return res.status(400).json({ 
        message: 'Lütfen tüm zorunlu alanları doldurun',
        required: ['name', 'address', 'phone'],
        received: req.body 
      });
    }

    const restaurant = await Restaurant.create({
      name,
      address,
      phone,
      isActive: true
    });

    console.log('Restaurant created successfully:', restaurant);
    res.status(201).json(restaurant);
  } catch (error) {
    console.error('Error creating restaurant:', error);
    res.status(500).json({ 
      message: 'Restoran oluşturulurken bir hata oluştu',
      error: error.message 
    });
  }
};

const updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByPk(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restoran bulunamadı' });
    }

    const { name, address, phone, isActive } = req.body;
    await restaurant.update({
      name,
      address,
      phone,
      isActive
    });

    res.json(restaurant);
  } catch (error) {
    console.error('Error updating restaurant:', error);
    res.status(500).json({ message: 'Restoran güncellenirken bir hata oluştu' });
  }
};

const deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByPk(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restoran bulunamadı' });
    }

    await restaurant.destroy();
    res.json({ message: 'Restoran başarıyla silindi' });
  } catch (error) {
    console.error('Error deleting restaurant:', error);
    res.status(500).json({ message: 'Restoran silinirken bir hata oluştu' });
  }
};

module.exports = {
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant
};