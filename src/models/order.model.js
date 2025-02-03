const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.Table, {
        foreignKey: "tableId",
        as: "table",
      });

      Order.belongsTo(models.Restaurant, {
        foreignKey: "restaurantId",
        as: "restaurant",
      });

      Order.hasMany(models.OrderItem, {
        foreignKey: "orderId",
        as: "items",
        onDelete: "CASCADE",
      });
    }
  }

  Order.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      orderNumber: {
        type: DataTypes.STRING,
        allowNull: false,
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
      totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        get() {
          const value = this.getDataValue("totalAmount");
          return value === null ? null : Number(value);
        },
      },
      customerName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      customerPhone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      specialRequests: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      estimatedTime: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      completedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      cancelReason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      restaurantId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      tableId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Order",
      tableName: "Orders",
    }
  );

  return Order;
};
