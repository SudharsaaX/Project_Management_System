import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import DarkModeContext from "../context/DarkModeContext";
import { FiMenu, FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";

// Animations
const slideIn = keyframes`
  from { transform: translateX(-100px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const SidebarContainer = styled.div`
  width: ${props => props.isCollapsed ? "80px" : "280px"};
  background: ${props =>
    props.darkMode
      ? "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)"
      : "linear-gradient(180deg, #4f46e5 0%, #3730a3 100%)"};
  color: white;
  padding: ${props => props.isCollapsed ? "30px 15px" : "30px"};
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: ${props =>
    props.darkMode
      ? "4px 0 15px rgba(0, 0, 0, 0.3)"
      : "4px 0 15px rgba(0, 0, 0, 0.1)"};
  animation: ${slideIn} 0.5s ease-in-out;
  height: 100vh;
  position: relative;
  transition: all 0.3s ease-in-out;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
  }

  @media (max-width: 768px) {
    position: fixed;
    left: ${props => props.isOpen ? "0" : "-100%"};
    z-index: 1000;
  }
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: ${props => props.isCollapsed ? "center" : "space-between"};
  margin-bottom: 30px;
  position: relative;
`;

const Logo = styled.h2`
  font-size: ${props => props.isCollapsed ? "1.2rem" : "1.8rem"};
  font-weight: 700;
  letter-spacing: 0.5px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all 0.3s ease;
  margin: 0;
  background: linear-gradient(45deg, #fff, rgba(255, 255, 255, 0.8));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const NavButton = styled.button`
  width: 100%;
  padding: ${props => props.isCollapsed ? "14px 10px" : "14px"};
  margin: 8px 0;
  border: none;
  border-radius: 12px;
  background: ${props =>
    props.active
      ? props.darkMode
        ? "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
        : "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)"
      : "transparent"};
  color: white;
  font-size: ${props => props.isCollapsed ? "0.9rem" : "1.1rem"};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: ${props => props.isCollapsed ? "center" : "flex-start"};
  gap: 12px;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    background: ${props =>
      props.active
        ? props.darkMode
          ? "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)"
          : "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)"
        : props.darkMode
        ? "rgba(255, 255, 255, 0.1)"
        : "rgba(255, 255, 255, 0.2)"};
  }

  &:active {
    transform: translateY(0);
  }

  span {
    font-size: 1.3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.3s ease;
  }

  p {
    margin: 0;
    display: ${props => props.isCollapsed ? "none" : "block"};
    white-space: nowrap;
    transition: all 0.3s ease;
    opacity: ${props => props.isCollapsed ? 0 : 1};
  }

  ${props => props.active && `
    &::after {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      height: 70%;
      background: white;
      border-radius: 0 4px 4px 0;
    }
  `}
`;

const ToggleButton = styled.button`
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
  margin-left: ${props => props.isCollapsed ? "0" : "8px"};

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    animation: ${pulse} 0.3s ease-in-out;
  }

  svg {
    font-size: 20px;
    transition: transform 0.3s ease;
  }

  @media (max-width: 768px) {
    position: absolute;
    right: ${props => props.isOpen ? "20px" : "-40px"};
    top: 20px;
    background: ${props =>
      props.darkMode
        ? "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
        : "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)"};
    padding: 10px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
`;

const NavSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  &:last-child {
    border-bottom: none;
    margin-top: auto;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 999;
  display: none;
  animation: ${fadeIn} 0.3s ease-in-out;

  @media (max-width: 768px) {
    display: ${props => props.isOpen ? "block" : "none"};
  }
`;

const Sidebar = () => {
  const { darkMode, setDarkMode } = useContext(DarkModeContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleSidebar = () => {
    if (window.innerWidth <= 768) {
      setIsOpen(!isOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (window.innerWidth <= 768) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <Overlay isOpen={isOpen} onClick={() => setIsOpen(false)} />
      <SidebarContainer darkMode={darkMode} isCollapsed={isCollapsed} isOpen={isOpen}>
        <Header isCollapsed={isCollapsed}>
          <Logo isCollapsed={isCollapsed}>
            {isCollapsed ? "TM" : "Task Manager"}
          </Logo>
          <ToggleButton 
            onClick={toggleSidebar} 
            darkMode={darkMode}
            isOpen={isOpen}
            isCollapsed={isCollapsed}
          >
            {window.innerWidth <= 768 ? (
              isOpen ? <FiX /> : <FiMenu />
            ) : (
              isCollapsed ? <FiChevronRight /> : <FiChevronLeft />
            )}
          </ToggleButton>
        </Header>
        
        <NavSection>
          <NavButton 
            onClick={() => handleNavigation("/dashboard")} 
            darkMode={darkMode}
            active={isActive("/dashboard")}
            isCollapsed={isCollapsed}
          >
            <span>📊</span>
            <p>Dashboard</p>
          </NavButton>
          
          <NavButton 
            onClick={() => handleNavigation("/tasks")} 
            darkMode={darkMode}
            active={isActive("/tasks")}
            isCollapsed={isCollapsed}
          >
            <span>✅</span>
            <p>Tasks</p>
          </NavButton>
          
          <NavButton 
            onClick={() => handleNavigation("/calendar")} 
            darkMode={darkMode}
            active={isActive("/calendar")}
            isCollapsed={isCollapsed}
          >
            <span>📅</span>
            <p>Calendar</p>
          </NavButton>

          <NavButton  onClick={() => handleNavigation("/team-members")} 
            darkMode={darkMode}
            active={isActive("/team-members")}
            isCollapsed={isCollapsed}
          >
            <span>👥</span>
            <p>Team Members</p>
          </NavButton>

        </NavSection>

        

        <NavSection>
          <NavButton 
            onClick={() => handleNavigation("/settings")} 
            darkMode={darkMode}
            active={isActive("/settings")}
            isCollapsed={isCollapsed}
          >
            <span>⚙️</span>
            <p>Settings</p>
          </NavButton>
          
          <NavButton 
            onClick={() => setDarkMode(!darkMode)} 
            darkMode={darkMode}
            isCollapsed={isCollapsed}
          >
            <span>{darkMode ? "☀️" : "🌙"}</span>
            <p>{darkMode ? "Light Mode" : "Dark Mode"}</p>
          </NavButton>
        </NavSection>
      </SidebarContainer>
    </>
  );
};

export default Sidebar;
