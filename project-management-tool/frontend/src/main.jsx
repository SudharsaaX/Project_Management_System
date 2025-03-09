import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { DarkModeProvider } from "./context/DarkModeContext"; // Import Dark Mode Context
import { TaskProvider } from "./context/TaskContext"; // Import Task Context

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <DarkModeProvider> {/* Wrap with Dark Mode Provider */}
      <TaskProvider> {/* Wrap with Task Provider */}
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </TaskProvider>
    </DarkModeProvider>
  </React.StrictMode>
);
