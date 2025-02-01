const { Restaurant, User, Table, Order } = require("../models");
const { Op } = require("sequelize");

const getStats = async (req, res) => {
  try {
    const { role, id, restaurantId } = req.user;
    const today = new Date();
    const RestaurantId = restaurantId;
    today.setHours(0, 0, 0, 0);

    let stats = [];

    switch (role) {
      case "admin":
        // Admin istatistikleri
        const totalRestaurants = await Restaurant.count();
        const totalUsers = await User.count();

        stats = [
          {
            id: 1,
            name: "Toplam Restoran",
            value: totalRestaurants.toString(),
            icon: "BuildingStorefrontIcon",
          },
          {
            id: 2,
            name: "Toplam Kullanıcı",
            value: totalUsers.toString(),
            icon: "UsersIcon",
          },
        ];
        break;

      case "restaurant_owner":
        // Restoran sahibi istatistikleri
        const restaurant = await Restaurant.findByPk(RestaurantId);
        if (!restaurant) {
          return res.status(404).json({ message: "Restoran bulunamadı" });
        }

        const totalTables = await Table.count({ where: { restaurantId } });

        const activeTables = await Table.count({
          where: {
            restaurantId,
            status: "occupied",
          },
        });
        const availableTables = await Table.count({
          where: {
            restaurantId,
            status: "available",
          },
        });
        const totalStaff = await User.count({
          where: {
            restaurantId,
            role: "staff",
          },
        });

        // Bugünkü siparişler
        const todayOrders = await Order.count({
          where: {
            restaurantId,
            createdAt: {
              [Op.gte]: today,
            },
          },
        });

        // Bugün ciro
        const todayRevenue = await Order.sum("totalAmount", {
          where: {
            restaurantId,

            createdAt: {
              [Op.gte]: today,
            },
          },
        });

        stats = [
          {
            id: 1,
            name: "Toplam Masa",
            value: totalTables.toString(),
            icon: "TableCellsIcon",
          },
          {
            id: 2,
            name: "Dolu Masa",
            value: activeTables.toString(),
            icon: "TableCellsIcon",
          },
          {
            id: 3,
            name: "Müsait Masa",
            value: availableTables.toString(),
            icon: "TableCellsIcon",
          },
          {
            id: 4,
            name: "Toplam Personel",
            value: totalStaff.toString(),
            icon: "UsersIcon",
          },
          {
            id: 5,
            name: "Bugünkü Sipariş",
            value: todayOrders.toString(),
            icon: "ClipboardDocumentListIcon",
          },
          {
            id: 6,
            name: "Bugünkü Ciro",
            value: `₺${(todayRevenue || 0).toLocaleString()}`,
            icon: "CurrencyDollarIcon",
          },
        ];
        break;

      case "staff":
        // Personel istatistikleri
        const staffActiveTables = await Table.count({
          where: {
            RestaurantId,
            status: "occupied",
          },
        });

        const activeOrders = await Order.count({
          where: {
            RestaurantId,
            status: "active",
          },
        });

        stats = [
          {
            id: 1,
            name: "Aktif Masalar",
            value: staffActiveTables.toString(),
            icon: "TableCellsIcon",
          },
          {
            id: 2,
            name: "Aktif Siparişler",
            value: activeOrders.toString(),
            icon: "ClipboardDocumentListIcon",
          },
        ];
        break;
    }

    res.json(stats);
  } catch (error) {
    console.error("Error in getStats:", error);
    res
      .status(500)
      .json({ message: "İstatistikler alınırken bir hata oluştu" });
  }
};

module.exports = {
  getStats,
};
