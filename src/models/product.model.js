const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Product = sequelize.define(
    "Product",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Categories",
          key: "id",
        },
      },
      restaurantId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Restaurants",
          key: "id",
        },
      },
      isAvailable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      calories: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "Kalori miktarı (kcal)",
      },
      portionSize: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Porsiyon büyüklüğü (örn: "250g", "1 dilim")',
      },
      preparationTime: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "Hazırlama süresi (dakika)",
      },
      allergens: {
        type: DataTypes.JSONB,
        allowNull: true,
        comment: "Alerjen bilgileri",
      },
      ingredients: {
        type: DataTypes.JSONB,
        allowNull: true,
        comment: "İçindekiler listesi",
      },
      nutritionInfo: {
        type: DataTypes.JSONB,
        allowNull: true,
        comment: "Besin değerleri (protein, karbonhidrat, yağ vb.)",
      },
      spicyLevel: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: 0,
          max: 5,
        },
        comment: "Acılık seviyesi (0-5)",
      },
      isVegetarian: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isVegan: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isGlutenFree: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      orderIndex: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      popularity: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: "Ürünün sipariş edilme sayısı",
      },
    },
    {
      timestamps: true,
    }
  );

  Product.associate = (models) => {
    Product.belongsTo(models.Category, {
      foreignKey: "categoryId",
      as: "category",
    });

    Product.belongsTo(models.Restaurant, {
      foreignKey: "restaurantId",
      as: "restaurant",
    });
  };

  return Product;
};
