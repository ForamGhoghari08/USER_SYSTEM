const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Queue = require("bull");
const SendMailer = require("../service/Mailer");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      req.flash("error_msg", "Email is already Registered");
      return res.redirect("/users/register");
    }

    user = new User({
      name,
      email,
      password,
    });

    await SendMailer({
      to: email,
      subject: "Welcome to the Platform!",
      body: "Hello! Thank you for joining our platform. We are excited to have you onboard!",
    });

    await user.save();

    req.flash("success_msg", "You are now Registered and can log in");
    res.redirect("/users/login");
  } catch (error) {
    console.error(error);
    req.flash("error_msg", "Registration failed");
    res.redirect("/users/register");
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      req.flash("error_msg", "Invalid email or password");
      return res.redirect("/users/login");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.flash("error_msg", "Invalid email or password");
      return res.redirect("/users/login");
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "your-jwt-secret",
      {
        expiresIn: "1d",
      }
    );

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    req.flash("error_msg", "Something went wrong");
    res.redirect("/users/login");
  }
};
