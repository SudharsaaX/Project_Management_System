const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// 🔹 Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// 🔹 Task Schema & Model
const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  createdAt: { type: String, required: true },
  deadline: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

const Task = mongoose.model("Task", TaskSchema);

// 🔹 Store user settings (Mock Database)
let settings = {
  darkMode: false,
  notifications: false,
  language: "English",
  privacy: "Public",
};

// ✅ Get user settings
app.get("/api/settings", (req, res) => {
  res.json(settings);
});

// ✅ Update user settings
app.post("/api/settings", (req, res) => {
  settings = { ...settings, ...req.body };
  res.json({ message: "✅ Settings updated successfully!", settings });
});

// ✅ Get all tasks
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Server error while fetching tasks" });
  }
});

// ✅ Add a new task
app.post("/api/tasks", async (req, res) => {
  try {
    const { title, description, createdAt, deadline } = req.body;
    if (!title || !createdAt || !deadline)
      return res.status(400).json({ error: "❌ Task title, createdAt, and deadline are required" });

    const newTask = new Task({ title, description, createdAt, deadline });
    await newTask.save();
    res.status(201).json({ message: "✅ Task added successfully!", task: newTask });
  } catch (err) {
    res.status(500).json({ error: "Server error while adding task" });
  }
});

// ✅ Toggle task completion
app.post("/api/tasks/:id/toggle", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "❌ Task not found" });

    task.completed = !task.completed;
    await task.save();
    res.json({ message: "✅ Task updated successfully!", task });
  } catch (err) {
    res.status(500).json({ error: "Server error while updating task" });
  }
});

// ✅ Delete a task
app.delete("/api/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: "❌ Task not found" });

    res.json({ message: "✅ Task deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Server error while deleting task" });
  }
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

const server = app.listen(PORT, () => {
    const networkInterfaces = require('os').networkInterfaces();
    let ipAddress = '';

    // Loop through network interfaces to find the local IP address
    for (const interfaceName in networkInterfaces) {
        for (const net of networkInterfaces[interfaceName]) {
            if (net.family === 'IPv4' && !net.internal) {
                ipAddress = net.address;
                break;
            }
        }
    }

    console.log(`Server is running on http://${ipAddress}:${PORT}`);
});