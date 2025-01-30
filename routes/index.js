const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");

router.get("/", (req, res) => {
  res.render("index", { title: "Welcome" });
});

router.get("/dashboard", protect, (req, res) => {
  res.render("dashboard", { user: req.user });
});

module.exports = router;
