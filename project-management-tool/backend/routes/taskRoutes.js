const express = require("express");
const { Task, Project, User } = require("../models/models");

const router = express.Router();

// ✅ Create Task
router.post("/", async (req, res) => {
  const { title, description, projectId, assignedToEmail } = req.body;

  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ error: "❌ Project Not Found!" });

    const user = await User.findOne({ email: assignedToEmail });
    if (!user) return res.status(404).json({ error: "❌ User Not Found!" });

    const task = new Task({ title, description, project: project._id, assignedTo: user._id });
    await task.save();

    res.status(201).json({ message: "✅ Task Created!", task });
  } catch (error) {
    res.status(400).json({ error: "❌ Task Creation Failed!", details: error.message });
  }
});

module.exports = router;
