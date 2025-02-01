const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Category = sequelize.define(
    "Category",
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
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      orderIndex: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      restaurantId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Restaurants",
          key: "id",
        },
      },
    },
    {
      timestamps: true,
    }
  );

  Category.associate = (models) => {
    Category.belongsTo(models.Restaurant, {
      foreignKey: "restaurantId",
      as: "restaurant",
    });

    Category.hasMany(models.Product, {
      foreignKey: "categoryId",
      as: "products",
    });
  };

  return Category;
};
