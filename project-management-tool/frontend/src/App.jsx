import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ProjectDetails from "./pages/ProjectDetails";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Tasks from "./pages/Tasks"; 
import Calendar from "./pages/Calendar"; 
import TeamMemberManagement from "./components/TeamMemberManagement";

// Add this import if you have a context for dark mode
import { useState } from 'react';

function App() {
  // Add dark mode state at the App level
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? 'dark-mode' : 'light-mode'}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard darkMode={darkMode} setDarkMode={setDarkMode} />} />
        <Route path="/project/:id" element={<ProjectDetails darkMode={darkMode} />} />
        <Route path="/profile" element={<Profile darkMode={darkMode} />} />
        <Route path="/settings" element={<Settings darkMode={darkMode} />} />
        <Route path="/tasks" element={<Tasks darkMode={darkMode} />} />
        <Route path="/calendar" element={<Calendar darkMode={darkMode} />} />
        <Route 
          path="/team-members" 
          element={<TeamMemberManagement darkMode={darkMode} />} 
        />
      </Routes>
    </div>
  );
}

export default App;
