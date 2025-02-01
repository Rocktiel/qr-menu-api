const { Table, Restaurant, Order, OrderItem, Product } = require("../models");
const QRCode = require("qrcode");
const { Op, Sequelize } = require("sequelize");

const generateQRCode = async (restaurantId, tableId, tableNumber) => {
  if (!process.env.FRONTEND_URL) {
    console.error("FRONTEND_URL is not defined in environment variables");
    // Varsayılan URL'yi kullan
    const defaultUrl = "http://localhost:3000";
    const menuUrl = `${defaultUrl}/menu/${restaurantId}/${tableNumber}`;
    console.log("Generated QR Code URL:", menuUrl);
    const qrCode = await QRCode.toDataURL(menuUrl);
    return qrCode;
  }

  const menuUrl = `${process.env.FRONTEND_URL}/menu/${restaurantId}/${tableNumber}`;
  console.log("Generated QR Code URL:", menuUrl);
  const qrCode = await QRCode.toDataURL(menuUrl);
  return qrCode;
};

const createTable = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { tableNumber, capacity, minCapacity, location, floor } = req.body;

    // QR kodu oluştur
    const qrCode = await generateQRCode(restaurantId, tableNumber, tableNumber);

    const table = await Table.create({
      tableNumber,
      capacity,
      minCapacity,
      location,
      floor,
      qrCode,
      restaurantId,
    });

    res.status(201).json(table);
  } catch (error) {
    console.error("Error in createTable:", error);
    res.status(500).json({ message: "Masa oluşturulurken bir hata oluştu" });
  }
};

const getTables = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    // Restoran kontrolü
    const restaurant = await Restaurant.findByPk(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restoran bulunamadı" });
    }

    // Yetki kontrolü
    if (
      req.user.role === "restaurant_owner" &&
      req.user.restaurantId !== parseInt(restaurantId)
    ) {
      return res
        .status(403)
        .json({ message: "Bu restoran için işlem yapamazsınız" });
    }

    const tables = await Table.findAll({
      where: { restaurantId },
      order: [[Sequelize.literal('CAST("tableNumber" AS INTEGER)'), "ASC"]],
    });

    res.json(tables);
  } catch (error) {
    console.error("Get tables error:", error);
    res.status(500).json({ message: "Masalar listelenirken bir hata oluştu" });
  }
};

const getTablesWithActiveOrders = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const tables = await Table.findAll({
      where: { restaurantId },
      include: [
        {
          model: Order,
          as: "orders",
          where: {
            status: ["pending", "preparing", "ready"],
          },
          required: false,
          include: [
            {
              model: OrderItem,
              as: "items",
              include: [
                {
                  model: Product,
                  as: "product",
                  attributes: ["id", "name", "price"],
                },
              ],
            },
          ],
        },
      ],
      order: [[Sequelize.literal('CAST("tableNumber" AS INTEGER)'), "ASC"]],
    });

    res.json(tables);
  } catch (error) {
    console.error("Error in getTablesWithActiveOrders:", error);
    res.status(500).json({ message: "Masalar yüklenirken bir hata oluştu" });
  }
};

const updateTable = async (req, res) => {
  try {
    const { tableId } = req.params;
    const { tableNumber, capacity, minCapacity, location, floor, shape } =
      req.body;

    const table = await Table.findByPk(tableId);
    if (!table) {
      return res.status(404).json({ message: "Masa bulunamadı" });
    }

    // Yetki kontrolü
    if (req.user.role === "staff") {
      return res.status(403).json({ message: "Bu işlem için yetkiniz yok" });
    }

    if (
      req.user.role === "restaurant_owner" &&
      req.user.restaurantId !== table.restaurantId
    ) {
      return res
        .status(403)
        .json({ message: "Bu masa için işlem yapamazsınız" });
    }

    // Masa numarası kontrolü
    if (tableNumber !== table.tableNumber) {
      const existingTable = await Table.findOne({
        where: {
          restaurantId: table.restaurantId,
          tableNumber,
          id: { [Op.ne]: tableId },
        },
      });

      if (existingTable) {
        return res
          .status(400)
          .json({ message: "Bu masa numarası zaten kullanılıyor" });
      }
    }

    await table.update({
      tableNumber,
      capacity,
      minCapacity,
      location,
      floor,
      shape,
    });

    res.json({ message: "Masa başarıyla güncellendi", table });
  } catch (error) {
    console.error("Update table error:", error);
    res.status(500).json({ message: "Masa güncellenirken bir hata oluştu" });
  }
};

const deleteTable = async (req, res) => {
  try {
    const { tableId } = req.params;

    const table = await Table.findByPk(tableId);
    if (!table) {
      return res.status(404).json({ message: "Masa bulunamadı" });
    }

    // Yetki kontrolü
    if (req.user.role === "staff") {
      return res.status(403).json({ message: "Bu işlem için yetkiniz yok" });
    }

    if (
      req.user.role === "restaurant_owner" &&
      req.user.restaurantId !== table.restaurantId
    ) {
      return res
        .status(403)
        .json({ message: "Bu masa için işlem yapamazsınız" });
    }

    await table.destroy();
    res.json({ message: "Masa başarıyla silindi" });
  } catch (error) {
    console.error("Delete table error:", error);
    res.status(500).json({ message: "Masa silinirken bir hata oluştu" });
  }
};

module.exports = {
  createTable,
  getTables,
  getTablesWithActiveOrders,
  updateTable,
  deleteTable,
};
