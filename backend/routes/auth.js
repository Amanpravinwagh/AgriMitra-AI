const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const protect = require("../middleware/auth");

const router = express.Router();


// REGISTER
router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      location,
      state,
      crop
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required"
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      location,
      state,
      crop
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        location: user.location,
        state: user.state,
        crop: user.crop
      }
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
});


// LOGIN
router.post("/login", async (req, res) => {
  try {
    const {
      email,
      password
    } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        location: user.location,
        state: user.state,
        crop: user.crop
      }
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
});


// GET CURRENT USER
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select("-password");

    res.json(user);

  } catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
});


// UPDATE PROFILE
router.put("/profile", protect, async (req, res) => {
  try {
    const {
      name,
      location,
      state,
      crop
    } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        name,
        location,
        state,
        crop
      },
      {
        new: true
      }
    ).select("-password");

    res.json(user);

  } catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
});


module.exports = router;