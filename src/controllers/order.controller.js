const { Order, OrderItem, Product, Table, sequelize } = require("../models");
const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");

const createOrder = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { restaurantId, tableNumber, items } = req.body;
    console.log("Gelen sipariş verileri:", {
      restaurantId,
      tableNumber,
      items,
    });

    // Masa kontrolü
    const table = await Table.findOne({
      where: {
        tableNumber: tableNumber,
        restaurantId: restaurantId,
      },
      transaction: t,
    });
    console.log("Masa bulundu:", table.toJSON());
    if (!table) {
      await t.rollback();
      return res.status(404).json({ message: "Masa bulunamadı" });
    }

    // Ürün fiyatlarını ve toplam tutarı hesapla
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findByPk(item.productId, {
        transaction: t,
      });
      if (!product) {
        await t.rollback();
        return res.status(404).json({
          message: `Ürün bulunamadı: ${item.productId}`,
        });
      }

      totalAmount += Number(product.price) * Number(item.quantity);
      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
        notes: item.notes || "",
        status: "pending",
        modifiers: JSON.stringify([]),
        discount: 0,
        isComplimentary: false,
      });
    }

    console.log("Sipariş oluşturuluyor:", {
      orderNumber: uuidv4().substring(0, 8).toUpperCase(),
      restaurantId,
      tableNumber,
      totalAmount,
      status: "pending",
    });

    // Siparişi oluştur
    const order = await Order.create(
      {
        orderNumber: uuidv4().substring(0, 8).toUpperCase(),
        restaurantId,
        tableNumber,
        tableId: table.id,
        totalAmount,
        status: "pending",
      },
      { transaction: t }
    );

    console.log("Order oluşturuldu:", order.toJSON());

    // Sipariş ürünlerini oluştur
    console.log("Sipariş ürünleri oluşturuluyor:", orderItems);
    const createdItems = await OrderItem.bulkCreate(
      orderItems.map((item) => ({
        ...item,
        orderId: order.id,
      })),
      { transaction: t }
    );

    // Masanın durumunu güncelle
    await table.update({ status: "occupied" }, { transaction: t });

    await t.commit();
    console.log("Transaction başarıyla tamamlandı");

    // Siparişi ürünleriyle birlikte getir
    const createdOrder = await Order.findByPk(order.id, {
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
        {
          model: Table,
          as: "table",
          attributes: ["id", "tableNumber", "status"],
        },
      ],
    });

    res.status(201).json(createdOrder);
  } catch (error) {
    await t.rollback();
    console.error("Error in createOrder:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      message: "Sipariş oluşturulurken bir hata oluştu",
      error: error.message,
      stack: error.stack,
    });
  }
};

const getActiveOrders = async (req, res) => {
  try {
    console.log("getActiveOrders");
    const { restaurantId } = req.params;

    const orders = await Order.findAll({
      where: {
        restaurantId,
        status: ["pending", "preparing", "ready"],
      },
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
        {
          model: Table,
          as: "table",
          attributes: ["id", "tableNumber", "status"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(orders);
  } catch (error) {
    console.error("Error in getActiveOrders:", error);
    res.status(500).json({ message: "Siparişler yüklenirken bir hata oluştu" });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    console.log("updateOrderStatus");
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findByPk(orderId, {
      include: [
        {
          model: Table,
          as: "table",
        },
      ],
    });

    if (!order) {
      return res.status(404).json({ message: "Sipariş bulunamadı" });
    }

    await order.update({ status });

    // Sipariş tamamlandıysa veya iptal edildiyse masayı boşalt
    if (status === "delivered" || status === "cancelled") {
      // Masada başka aktif sipariş var mı kontrol et
      const activeOrders = await Order.count({
        where: {
          tableId: order.tableId,
          status: ["pending", "preparing", "ready"],
          id: { [Op.ne]: orderId }, // Mevcut sipariş hariç
        },
      });

      // Başka aktif sipariş yoksa masayı boşalt
      if (activeOrders === 0) {
        await order.table.update({ status: "available" });
      }
    }

    res.json(order);
  } catch (error) {
    console.error("Error in updateOrderStatus:", error);
    res
      .status(500)
      .json({ message: "Sipariş durumu güncellenirken bir hata oluştu" });
  }
};

const getOrderHistory = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { startDate, endDate, status } = req.query;

    const where = {
      restaurantId,
    };

    if (status) {
      where.status = status;
    }

    if (startDate && endDate) {
      where.createdAt = {
        [sequelize.Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    const orders = await Order.findAll({
      where,
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
        {
          model: Table,
          as: "table",
          attributes: ["id", "tableNumber"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(orders);
  } catch (error) {
    console.error("Error in getOrderHistory:", error);
    res
      .status(500)
      .json({ message: "Sipariş geçmişi yüklenirken bir hata oluştu" });
  }
};

module.exports = {
  createOrder,
  getActiveOrders,
  updateOrderStatus,
  getOrderHistory,
};
