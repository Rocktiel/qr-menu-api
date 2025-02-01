const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Table extends Model {
    static associate(models) {
      Table.belongsTo(models.Restaurant, {
        foreignKey: "restaurantId",
        as: "restaurant",
      });

      Table.hasMany(models.Order, {
        foreignKey: "tableId",
        as: "orders",
      });
    }
  }

  Table.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      tableNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 4,
      },
      minCapacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      floor: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      shape: {
        type: DataTypes.ENUM("square", "round", "rectangle"),
        defaultValue: "square",
      },
      qrCode: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      status: {
        type: DataTypes.ENUM(
          "available",
          "occupied",
          "reserved",
          "maintenance"
        ),
        defaultValue: "available",
      },
      smokingAllowed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      lastOccupiedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      lastCleanedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      coordinates: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      restaurantId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Table",
      tableName: "tables",
    }
  );

  return Table;
};
