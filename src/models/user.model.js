const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      role: {
        type: DataTypes.ENUM("admin", "restaurant_owner", "staff"),
        allowNull: false,
        defaultValue: "staff",
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      restaurantId: {
        type: DataTypes.INTEGER,
        allowNull: true,
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

  User.associate = (models) => {
    User.belongsTo(models.Restaurant, {
      foreignKey: "restaurantId",
      as: "restaurant",
    });

    User.hasMany(models.Restaurant, {
      foreignKey: "ownerId",
      as: "ownedRestaurants",
    });
  };

  return User;
};
