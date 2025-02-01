const jwt = require("jsonwebtoken");
const { User } = require("../models");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token bulunamadı" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "Kullanıcı bulunamadı" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ message: "Geçersiz token" });
  }
};

const roleMiddleware = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Bu işlem için yetkiniz bulunmuyor",
      });
    }
    next();
  };
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Bu işlem için yönetici yetkisi gerekiyor" });
  }
  next();
};

const isRestaurantOwner = (req, res, next) => {
  if (req.user.role !== "restaurant_owner") {
    return res
      .status(403)
      .json({ message: "Bu işlem için restoran sahibi yetkisi gerekiyor" });
  }
  next();
};

const isStaff = (req, res, next) => {
  if (req.user.role !== "staff") {
    return res
      .status(403)
      .json({ message: "Bu işlem için personel yetkisi gerekiyor" });
  }
  next();
};

module.exports = {
  authMiddleware,
  roleMiddleware,
  isAdmin,
  isRestaurantOwner,
  isStaff,
};
