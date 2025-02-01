const { Category, Restaurant, Product } = require("../models");

const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const category = await Category.create({
      name,
      restaurantId: req.user.restaurantId,
    });

    res.status(201).json(category);
  } catch (error) {
    console.error("Error in createCategory:", error);
    res
      .status(500)
      .json({ message: "Kategori oluşturulurken bir hata oluştu" });
  }
};
const getCategoriesForRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params; // URL'den restaurantId'yi al

    const categories = await Category.findAll({
      where: { restaurantId: restaurantId },
      include: [
        {
          model: Product,
          as: "products",
          attributes: ["id", "name", "price", "isAvailable"],
        },
      ],
      order: [["orderIndex", "ASC"]],
    });

    res.json(categories);
  } catch (error) {
    console.error("Error in getCategories:", error);
    res
      .status(500)
      .json({ message: "Kategoriler yüklenirken bir hata oluştu" });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { restaurantId: req.user.restaurantId },
      include: [
        {
          model: Product,
          as: "products",
          attributes: ["id", "name", "price", "isAvailable"],
        },
      ],
      order: [["orderIndex", "ASC"]],
    });

    res.json(categories);
  } catch (error) {
    console.error("Error in getCategories:", error);
    res
      .status(500)
      .json({ message: "Kategoriler yüklenirken bir hata oluştu" });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const category = await Category.findOne({
      where: {
        id,
        restaurantId: req.user.restaurantId,
      },
    });

    if (!category) {
      return res.status(404).json({ message: "Kategori bulunamadı" });
    }

    await category.update({ name });
    res.json(category);
  } catch (error) {
    console.error("Error in updateCategory:", error);
    res
      .status(500)
      .json({ message: "Kategori güncellenirken bir hata oluştu" });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findOne({
      where: {
        id,
        restaurantId: req.user.restaurantId,
      },
    });

    if (!category) {
      return res.status(404).json({ message: "Kategori bulunamadı" });
    }

    // Kategoriye ait ürünleri kontrol et
    const productCount = await Product.count({
      where: { categoryId: id },
    });

    if (productCount > 0) {
      return res.status(400).json({
        message: "Bu kategoride ürünler bulunuyor. Önce ürünleri silmelisiniz.",
      });
    }

    await category.destroy();
    res.json({ message: "Kategori başarıyla silindi" });
  } catch (error) {
    console.error("Error in deleteCategory:", error);
    res.status(500).json({ message: "Kategori silinirken bir hata oluştu" });
  }
};

module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  getCategoriesForRestaurant,
};
