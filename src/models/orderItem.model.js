const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const OrderItem = sequelize.define(
    "OrderItem",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Orders",
          key: "id",
        },
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Products",
          key: "id",
        },
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
          min: 1,
        },
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM(
          "pending",
          "preparing",
          "ready",
          "delivered",
          "cancelled"
        ),
        defaultValue: "pending",
      },
      specialInstructions: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      modifiers: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: [],
      },
      discount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0,
      },
      isComplimentary: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      timestamps: true,
    }
  );

  OrderItem.associate = function (models) {
    OrderItem.belongsTo(models.Order, {
      foreignKey: "orderId",
      as: "order",
      onDelete: "CASCADE",
    });
    OrderItem.belongsTo(models.Product, {
      foreignKey: "productId",
      as: "product",
    });
  };

  return OrderItem;
};
