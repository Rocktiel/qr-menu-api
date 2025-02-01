const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Restaurant = sequelize.define(
    "Restaurant",
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
      address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      logo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      ownerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Users",
          key: "id",
        },
      },
    },
    {
      timestamps: true,
    }
  );

  Restaurant.associate = (models) => {
    Restaurant.hasMany(models.User, {
      foreignKey: "restaurantId",
      as: "users",
    });

    Restaurant.belongsTo(models.User, {
      foreignKey: "ownerId",
      as: "owner",
    });

    Restaurant.hasMany(models.Table, {
      foreignKey: "restaurantId",
      as: "tables",
    });

    Restaurant.hasMany(models.Order, {
      foreignKey: "restaurantId",
      as: "orders",
    });
  };

  return Restaurant;
};
