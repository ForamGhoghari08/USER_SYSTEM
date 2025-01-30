const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    console.log("Token:", token); // Debugging

    if (!token) {
      req.flash("error_msg", "Please log in to access this resource");
      return res.redirect("/users/login");
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-jwt-secret"
    );
    const user = await User.findById(decoded.id);

    if (!user) {
      req.flash("error_msg", "User no longer exists");
      return res.redirect("/users/login");
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error.message);
    req.flash("error_msg", "Please log in to access this resource");
    res.redirect("/users/login");
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      req.flash(
        "error_msg",
        "You do not have permission to perform this action"
      );
      return res.redirect("/");
    }
    next();
  };
};
