const express = require("express");
const admin = require("firebase-admin");
const { User } = require("../models/models");

const router = express.Router();

// ✅ Signup API
router.post("/signup", async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const user = await admin.auth().createUser({ email, password });
    const newUser = new User({ email, name, profilePic: "" });
    await newUser.save();

    res.status(201).json({ message: "✅ User created successfully!", user });
  } catch (error) {
    res.status(400).json({ error: "❌ Signup Failed!", details: error.message });
  }
});

// ✅ Login API
router.post("/login", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await admin.auth().getUserByEmail(email);
    res.json({ message: "✅ Login Successful!", user });
  } catch (error) {
    res.status(400).json({ error: "❌ Invalid Credentials!" });
  }
});

module.exports = router;
