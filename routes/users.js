const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/register", (req, res) => {
  res.render("register", { title: "Register" });
});

router.post("/register", userController.register);

router.get("/login", (req, res) => {
  res.render("login", { title: "Login" });
});

router.post("/login", userController.login);

router.get("/logout", (req, res) => {
  res.clearCookie("jwt");
  req.flash("success_msg", "You Are Logged Out");
  res.redirect("/");
});

module.exports = router;
