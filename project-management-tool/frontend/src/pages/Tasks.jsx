import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DarkModeContext from "../context/DarkModeContext";
import styled, { keyframes } from "styled-components";
import axios from "axios";
import Sidebar from "../components/Sidebar";

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { transform: translateX(-100px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

// Styled Components
const Layout = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${(props) =>
    props.darkMode
      ? "linear-gradient(120deg, #1a202c 0%, #2d3748 100%)"
      : "linear-gradient(120deg, #f1f5f9 0%, #e2e8f0 100%)"};
  color: ${(props) => (props.darkMode ? "#f1f5f9" : "#1e293b")};
  font-family: "Inter", sans-serif;
`;

const Content = styled.div`
  flex: 1;
  padding: 40px;
  overflow-y: auto;
  animation: ${fadeIn} 0.5s ease;
`;

const TasksContainer = styled.div`
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: ${fadeIn} 0.6s ease-out;
  flex: 1;
`;

const Title = styled.h1`
  font-size: 2.8rem;
  margin-bottom: 20px;
  background: ${(props) =>
    props.darkMode
      ? "linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)"
      : "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)"};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: ${(props) =>
    props.darkMode ? "none" : "2px 2px 4px rgba(0, 0, 0, 0.1)"};
`;

const TaskList = styled.div`
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const TaskItem = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 24px;
  background: ${(props) =>
    props.darkMode
      ? "linear-gradient(145deg, #1e293b 0%, #0f172a 100%)"
      : "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)"};
  border-radius: 16px;
  box-shadow: ${(props) =>
    props.darkMode
      ? "0 8px 32px rgba(0, 0, 0, 0.3)"
      : "0 8px 32px rgba(0, 0, 0, 0.1)"};
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid ${(props) =>
    props.darkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)"};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${(props) =>
      props.darkMode
        ? "0 12px 40px rgba(0, 0, 0, 0.4)"
        : "0 12px 40px rgba(0, 0, 0, 0.15)"};
  }
`;

const TaskCheckbox = styled.input`
  width: 20px;
  height: 20px;
  margin-right: 16px;
  cursor: pointer;
  accent-color: ${(props) => (props.darkMode ? "#3b82f6" : "#4f46e5")};
`;

const TaskTitle = styled.span`
  flex: 1;
  font-size: 1.1rem;
  color: ${(props) => (props.darkMode ? "#ffffff" : "#1e293b")};
  text-decoration: ${(props) => (props.completed ? "line-through" : "none")};
  opacity: ${(props) => (props.completed ? 0.7 : 1)};
`;

const TaskActions = styled.div`
  display: flex;
  gap: 12px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => (props.darkMode ? "#94a3b8" : "#64748b")};
  cursor: pointer;
  padding: 4px;
  font-size: 1.2rem;
  transition: all 0.2s ease;
  border-radius: 8px;

  &:hover {
    color: ${(props) => (props.darkMode ? "#60a5fa" : "#4f46e5")};
    background: ${(props) =>
      props.darkMode
        ? "rgba(255, 255, 255, 0.1)"
        : "rgba(79, 70, 229, 0.1)"};
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: ${(props) => (props.show ? "flex" : "none")};
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalContent = styled.div`
  background: ${props => props.darkMode ? "#1e293b" : "#ffffff"};
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 400px;
  z-index: 1000;
`;

const ModalTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${props => props.darkMode ? "#f1f5f9" : "#1e293b"};
  margin: 0 0 20px 0;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
`;

const Label = styled.label`
  font-size: 0.9rem;
  color: ${props => props.darkMode ? "#94a3b8" : "#64748b"};
`;

const Input = styled.input`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid ${props => props.darkMode ? "#2e3f50" : "#e2e8f0"};
  background: ${props => props.darkMode ? "#1e293b" : "#ffffff"};
  color: ${props => props.darkMode ? "#f1f5f9" : "#1e293b"};
  font-size: 0.9rem;

  &:focus {
    outline: none;
    border-color: ${props => props.darkMode ? "#60a5fa" : "#3b82f6"};
  }
`;

const TextArea = styled.textarea`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid ${props => props.darkMode ? "#2e3f50" : "#e2e8f0"};
  background: ${props => props.darkMode ? "#1e293b" : "#ffffff"};
  color: ${props => props.darkMode ? "#f1f5f9" : "#1e293b"};
  font-size: 0.9rem;

  &:focus {
    outline: none;
    border-color: ${props => props.darkMode ? "#60a5fa" : "#3b82f6"};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 16px;
`;

const Button = styled.button`
  flex: 1;
  padding: 8px;
  border-radius: 4px;
  border: none;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s;

  ${props =>
    props.primary
      ? `
    background: ${props.darkMode ? "#60a5fa" : "#3b82f6"};
    color: white;
    
    &:hover {
      background: ${props.darkMode ? "#3b82f6" : "#2563eb"};
    }
  `
      : `
    background: ${props.darkMode ? "#2e3f50" : "#f1f5f9"};
    color: ${props.darkMode ? "#f1f5f9" : "#1e293b"};
    
    &:hover {
      background: ${props.darkMode ? "#374151" : "#e2e8f0"};
    }
  `}
`;

const AddButton = styled.button`
  position: fixed;
  bottom: 32px;
  right: 32px;
  width: 60px;
  height: 60px;
  border-radius: 30px;
  background: ${(props) =>
    props.darkMode
      ? "linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)"
      : "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)"};
  color: white;
  border: none;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${(props) =>
    props.darkMode
      ? "0 8px 32px rgba(59, 130, 246, 0.4)"
      : "0 8px 32px rgba(79, 70, 229, 0.4)"};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px) scale(1.05);
    box-shadow: ${(props) =>
      props.darkMode
        ? "0 12px 40px rgba(59, 130, 246, 0.5)"
        : "0 12px 40px rgba(79, 70, 229, 0.5)"};
  }
`;

function Tasks() {
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useContext(DarkModeContext);
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    deadline: "",
    createdAt: new Date().toISOString().slice(0, 16)
  });

  // Fetch all tasks from the backend
  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Fetch tasks from MongoDB when component mounts
  useEffect(() => {
    fetchTasks();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add a new task
  const addTask = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!newTask.title.trim()) {
      alert("Task title is required");
      return;
    }
    
    try {
      const response = await axios.post("http://localhost:5000/api/tasks", newTask);
      
      // Make sure we get the full task object from the response
      const addedTask = response.data.task || response.data;
      
      // Update tasks array with the new task from response using functional update
      setTasks(prevTasks => [...prevTasks, addedTask]);
      
      // Reset form
      setNewTask({
        title: "",
        description: "",
        deadline: "",
        createdAt: new Date().toISOString().slice(0, 16)
      });
      
      // Close modal
      setShowModal(false);
    } catch (error) {
      console.error("Error adding task:", error);
      alert("Failed to add task. Please try again.");
    }
  };

  // Toggle task completion status
  const toggleTaskCompletion = async (id) => {
    try {
      // Find the task to toggle
      const taskToToggle = tasks.find((task) => task._id === id);
      
      // Update the task on the server using the correct endpoint
      const response = await axios.post(`http://localhost:5000/api/tasks/${id}/toggle`);
      
      // Update the task in local state to reflect changes
      setTasks(
        tasks.map((task) =>
          task._id === id ? { ...task, completed: !task.completed } : task
        )
      );
    } catch (error) {
      console.error("Error toggling task completion:", error);
    }
  };

  // Delete a task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      // Filter out the deleted task
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const completedTasks = tasks.filter((task) => task.completed).length;
  const progress = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  return (
    <Layout darkMode={darkMode}>
      <Sidebar />
      <Content darkMode={darkMode}>
        <Title darkMode={darkMode}>Tasks</Title>
        <TaskList>
          {tasks.map((task) => (
            <TaskItem key={task._id} darkMode={darkMode}>
              <TaskCheckbox
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTaskCompletion(task._id)}
                darkMode={darkMode}
              />
              <TaskTitle darkMode={darkMode} completed={task.completed}>
                {task.title}
              </TaskTitle>
              <TaskActions>
                <ActionButton
                  onClick={() => deleteTask(task._id)}
                  darkMode={darkMode}
                >
                  🗑️
                </ActionButton>
              </TaskActions>
            </TaskItem>
          ))}
        </TaskList>
        <AddButton onClick={() => setShowModal(true)} darkMode={darkMode}>
          +
        </AddButton>
      </Content>

      <Modal show={showModal} darkMode={darkMode}>
        <ModalContent darkMode={darkMode}>
          <ModalTitle darkMode={darkMode}>Add New Task</ModalTitle>
          <form onSubmit={addTask}>
            <FormGroup>
              <Label darkMode={darkMode}>Title</Label>
              <Input
                type="text"
                name="title"
                value={newTask.title}
                onChange={handleChange}
                placeholder="Enter task title"
                darkMode={darkMode}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label darkMode={darkMode}>Description</Label>
              <TextArea
                name="description"
                value={newTask.description}
                onChange={handleChange}
                placeholder="Enter task description"
                darkMode={darkMode}
              />
            </FormGroup>
            <FormGroup>
              <Label darkMode={darkMode}>Deadline</Label>
              <Input
                type="datetime-local"
                name="deadline"
                value={newTask.deadline}
                onChange={handleChange}
                darkMode={darkMode}
              />
            </FormGroup>
            <ButtonGroup>
              <Button
                type="button"
                onClick={() => setShowModal(false)}
                darkMode={darkMode}
              >
                Cancel
              </Button>
              <Button type="submit" primary darkMode={darkMode}>
                Add Task
              </Button>
            </ButtonGroup>
          </form>
        </ModalContent>
      </Modal>
    </Layout>
  );
}

export default Tasks;
