const express = require("express");
const { User, Project } = require("../models/models");

const router = express.Router();

// ✅ Create Project
router.post("/", async (req, res) => {
  const { title, description, ownerEmail } = req.body;

  try {
    const owner = await User.findOne({ email: ownerEmail });
    if (!owner) return res.status(404).json({ error: "❌ User not found!" });

    const project = new Project({ title, description, owner: owner._id, members: [owner._id] });
    await project.save();

    res.status(201).json({ message: "✅ Project Created!", project });
  } catch (error) {
    res.status(400).json({ error: "❌ Project Creation Failed!", details: error.message });
  }
});

// ✅ Get User Projects
router.get("/:email", async (req, res) => {
  const email = req.params.email;
  
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "❌ User Not Found!" });

    const projects = await Project.find({ members: user._id }).populate("owner", "name email");
    res.json({ projects });
  } catch (error) {
    res.status(400).json({ error: "❌ Fetch Failed!", details: error.message });
  }
});

module.exports = router;
