const bcrypt = require("bcryptjs");
const { User, Restaurant } = require("../models");
const { Op } = require("sequelize");

// Tüm kullanıcıları getir
const getUsers = async (req, res) => {
  try {
    const { role, restaurantId, id } = req.user;
    let where = { id: { [Op.ne]: id } }; // Kendisi hariç

    if (role === "admin") {
      // Admin sadece admin ve restoran sahiplerini görebilir
      where.role = { [Op.in]: ["admin", "restaurant_owner"] };
    } else if (role === "restaurant_owner") {
      // Restoran sahibi sadece kendi restoranının personelini görebilir
      where.restaurantId = restaurantId;
      where.role = "staff";
    } else {
      return res.status(403).json({ message: "Bu işlem için yetkiniz yok" });
    }

    const users = await User.findAll({
      where,
      attributes: { exclude: ["password"] },
      include: [
        {
          model: Restaurant,
          as: "restaurant",
          attributes: ["name"],
        },
      ],
    });

    res.json(users);
  } catch (error) {
    console.error("Error in getUsers:", error);
    res.status(500).json({ message: "Kullanıcılar alınırken bir hata oluştu" });
  }
};

// Kullanıcı oluştur
const createUser = async (req, res) => {
  try {
    const { role: currentUserRole, restaurantId: currentUserRestaurantId } =
      req.user;
    const {
      username,
      password,
      role,
      restaurantId,
      firstName,
      lastName,
      email,
      phone,
    } = req.body;

    // Yetki kontrolü
    if (currentUserRole === "admin" && role === "staff") {
      return res.status(403).json({ message: "Admin personel ekleyemez" });
    }

    if (currentUserRole === "restaurant_owner" && role !== "staff") {
      return res
        .status(403)
        .json({ message: "Restoran sahibi sadece personel ekleyebilir" });
    }

    // Restoran sahibi sadece kendi restoranına personel ekleyebilir
    if (
      currentUserRole === "restaurant_owner" &&
      currentUserRestaurantId !== restaurantId
    ) {
      return res
        .status(403)
        .json({
          message: "Sadece kendi restoranınıza personel ekleyebilirsiniz",
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      password: hashedPassword,
      role,
      restaurantId:
        currentUserRole === "restaurant_owner"
          ? currentUserRestaurantId
          : restaurantId || null,
      firstName,
      lastName,
      email,
      phone,
      isActive: true,
    });

    res.status(201).json({
      message: "Kullanıcı başarıyla oluşturuldu",
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("Error in createUser:", error);
    if (error.name === "SequelizeUniqueConstraintError") {
      res.status(400).json({ message: "Bu kullanıcı adı zaten kullanılıyor" });
    } else {
      res
        .status(500)
        .json({ message: "Kullanıcı oluşturulurken bir hata oluştu" });
    }
  }
};

// Kullanıcı güncelle
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role: currentUserRole, restaurantId: currentUserRestaurantId } =
      req.user;
    const { username, role, restaurantId, name, email, phone, isActive } =
      req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    // Yetki kontrolleri
    if (currentUserRole === "restaurant_owner") {
      if (user.restaurantId !== currentUserRestaurantId) {
        return res
          .status(403)
          .json({ message: "Bu kullanıcıyı düzenleme yetkiniz yok" });
      }
      if (role && role !== "staff") {
        return res
          .status(403)
          .json({
            message: "Restoran sahibi sadece personel rolünü düzenleyebilir",
          });
      }
    }

    await user.update({
      username,
      role,
      restaurantId:
        currentUserRole === "restaurant_owner"
          ? currentUserRestaurantId
          : restaurantId,
      name,
      email,
      phone,
      isActive,
    });

    res.json({
      message: "Kullanıcı başarıyla güncellendi",
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error("Error in updateUser:", error);
    if (error.name === "SequelizeUniqueConstraintError") {
      res.status(400).json({ message: "Bu kullanıcı adı zaten kullanılıyor" });
    } else {
      res
        .status(500)
        .json({ message: "Kullanıcı güncellenirken bir hata oluştu" });
    }
  }
};

// Kullanıcı sil
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role: currentUserRole, restaurantId: currentUserRestaurantId } =
      req.user;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    // Yetki kontrolleri
    if (currentUserRole === "restaurant_owner") {
      if (user.restaurantId !== currentUserRestaurantId) {
        return res
          .status(403)
          .json({ message: "Bu kullanıcıyı silme yetkiniz yok" });
      }
      if (user.role !== "staff") {
        return res
          .status(403)
          .json({ message: "Restoran sahibi sadece personel silebilir" });
      }
    }

    await user.destroy();
    res.json({ message: "Kullanıcı başarıyla silindi" });
  } catch (error) {
    console.error("Error in deleteUser:", error);
    res.status(500).json({ message: "Kullanıcı silinirken bir hata oluştu" });
  }
};

// Personel listesi getir
const getStaff = async (req, res) => {
  try {
    const { restaurantId } = req.user;

    const staff = await User.findAll({
      where: {
        restaurantId,
        role: "staff",
      },
      attributes: { exclude: ["password"] },
    });

    res.json(staff);
  } catch (error) {
    console.error("Error in getStaff:", error);
    res
      .status(500)
      .json({ message: "Personel listesi alınırken bir hata oluştu" });
  }
};

module.exports = {
  getUsers,
  getStaff,
  createUser,
  updateUser,
  deleteUser,
};
