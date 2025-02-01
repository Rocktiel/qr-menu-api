const { Product, Category } = require("../models");

const createProduct = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const {
      name,
      description,
      price,
      image,
      calories,
      portionSize,
      preparationTime,
      allergens,
      ingredients,
      nutritionInfo,
      spicyLevel,
      isVegetarian,
      isVegan,
      isGlutenFree,
    } = req.body;

    // Kategori kontrolü
    const category = await Category.findOne({
      where: {
        id: categoryId,
        restaurantId: req.user.restaurantId,
      },
    });

    if (!category) {
      return res.status(404).json({ message: "Kategori bulunamadı" });
    }

    const product = await Product.create({
      name,
      description,
      price,
      image,
      calories,
      portionSize,
      preparationTime,
      allergens,
      ingredients,
      nutritionInfo,
      spicyLevel,
      isVegetarian,
      isVegan,
      isGlutenFree,
      categoryId,
      restaurantId: req.user.restaurantId,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Error in createProduct:", error);
    res.status(500).json({ message: "Ürün oluşturulurken bir hata oluştu" });
  }
};

const getProductsForRestaurant = async (req, res) => {
  try {
    const { categoryId, restaurantId } = req.params;
    const where = { restaurantId: restaurantId };

    if (categoryId) {
      where.categoryId = categoryId;
    }

    const products = await Product.findAll({
      where,
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
        },
      ],
      order: [["orderIndex", "ASC"]],
    });

    res.json(products);
  } catch (error) {
    console.error("Error in getProducts:", error);
    res.status(500).json({ message: "Ürünler yüklenirken bir hata oluştu" });
  }
};

const getProducts = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const where = { restaurantId: req.user.restaurantId };

    if (categoryId) {
      where.categoryId = categoryId;
    }

    const products = await Product.findAll({
      where,
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
        },
      ],
      order: [["orderIndex", "ASC"]],
    });

    res.json(products);
  } catch (error) {
    console.error("Error in getProducts:", error);
    res.status(500).json({ message: "Ürünler yüklenirken bir hata oluştu" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const {
      name,
      description,
      price,
      image,
      calories,
      portionSize,
      preparationTime,
      allergens,
      ingredients,
      nutritionInfo,
      spicyLevel,
      isVegetarian,
      isVegan,
      isGlutenFree,
      categoryId,
    } = req.body;

    const product = await Product.findOne({
      where: {
        id: productId,
        restaurantId: req.user.restaurantId,
      },
    });

    if (!product) {
      return res.status(404).json({ message: "Ürün bulunamadı" });
    }

    if (categoryId) {
      const category = await Category.findOne({
        where: {
          id: categoryId,
          restaurantId: req.user.restaurantId,
        },
      });

      if (!category) {
        return res.status(404).json({ message: "Kategori bulunamadı" });
      }
    }

    await product.update({
      name,
      description,
      price,
      image,
      calories,
      portionSize,
      preparationTime,
      allergens,
      ingredients,
      nutritionInfo,
      spicyLevel,
      isVegetarian,
      isVegan,
      isGlutenFree,
      categoryId,
    });

    res.json(product);
  } catch (error) {
    console.error("Error in updateProduct:", error);
    res.status(500).json({ message: "Ürün güncellenirken bir hata oluştu" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findOne({
      where: {
        id: productId,
        restaurantId: req.user.restaurantId,
      },
    });

    if (!product) {
      return res.status(404).json({ message: "Ürün bulunamadı" });
    }

    await product.destroy();
    res.json({ message: "Ürün başarıyla silindi" });
  } catch (error) {
    console.error("Error in deleteProduct:", error);
    res.status(500).json({ message: "Ürün silinirken bir hata oluştu" });
  }
};

const toggleProductAvailability = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findOne({
      where: {
        id: productId,
        restaurantId: req.user.restaurantId,
      },
    });

    if (!product) {
      return res.status(404).json({ message: "Ürün bulunamadı" });
    }

    await product.update({ isAvailable: !product.isAvailable });
    res.json(product);
  } catch (error) {
    console.error("Error in toggleProductAvailability:", error);
    res
      .status(500)
      .json({ message: "Ürün durumu güncellenirken bir hata oluştu" });
  }
};

module.exports = {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  toggleProductAvailability,
  getProductsForRestaurant,
};
