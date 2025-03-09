import React, { useState, useEffect, useContext } from "react";
import styled, { keyframes } from "styled-components";
import axios from "axios";
import DarkModeContext from "../context/DarkModeContext";
import Sidebar from "../components/Sidebar";
import { FiSettings, FiBell, FiUser, FiLayout, FiDatabase, FiShield, FiGlobe, FiClock, FiMail } from "react-icons/fi";

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
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

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 30px;
  background: ${(props) =>
    props.darkMode
      ? "linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)"
      : "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)"};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 25px;
  max-width: 1200px;
`;

const SettingsCard = styled.div`
  background: ${(props) =>
    props.darkMode
      ? "linear-gradient(145deg, #1e293b 0%, #0f172a 100%)"
      : "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)"};
  border-radius: 20px;
  overflow: hidden;
  box-shadow: ${(props) =>
    props.darkMode
      ? "0 10px 15px -3px rgba(0, 0, 0, 0.4)"
      : "0 10px 15px -3px rgba(0, 0, 0, 0.1)"};
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid ${(props) =>
    props.darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)"};

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${(props) =>
      props.darkMode
        ? "0 20px 25px -5px rgba(0, 0, 0, 0.5)"
        : "0 20px 25px -5px rgba(0, 0, 0, 0.1)"};
  }
`;

const CardHeader = styled.div`
  background: ${(props) =>
    props.darkMode
      ? "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
      : "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)"};
  padding: 20px;
  color: white;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
`;

const CardIcon = styled.span`
  font-size: 1.8rem;
`;

const CardBody = styled.div`
  padding: 25px;
`;

const SettingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid ${(props) =>
    props.darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"};
  
  &:last-child {
    border-bottom: none;
  }
`;

const SettingLabel = styled.div`
  display: flex;
  flex-direction: column;
`;

const SettingName = styled.span`
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 4px;
`;

const SettingDescription = styled.span`
  font-size: 0.9rem;
  color: ${(props) => (props.darkMode ? "#94a3b8" : "#64748b")};
`;

const Switch = styled.label`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
  
  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
`;

const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${(props) => 
    props.darkMode ? "#4b5563" : "#cbd5e1"};
  transition: .4s;
  border-radius: 34px;
  
  &:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  }
  
  input:checked + & {
    background-color: ${(props) => 
      props.darkMode ? "#3b82f6" : "#4f46e5"};
  }
  
  input:checked + &:before {
    transform: translateX(26px);
  }
`;

const Select = styled.select`
  padding: 10px 16px;
  border-radius: 10px;
  border: 2px solid ${(props) =>
    props.darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"};
  background: ${(props) =>
    props.darkMode
      ? "rgba(255, 255, 255, 0.05)"
      : "rgba(255, 255, 255, 0.9)"};
  color: ${(props) => (props.darkMode ? "#ffffff" : "#1e293b")};
  font-size: 1rem;
  min-width: 150px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${(props) =>
      props.darkMode ? "#3b82f6" : "#4f46e5"};
    box-shadow: 0 0 0 2px
      ${(props) =>
        props.darkMode
          ? "rgba(59, 130, 246, 0.2)"
          : "rgba(79, 70, 229, 0.2)"};
  }
`;

const Button = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  background: ${(props) =>
    props.primary
      ? props.darkMode
        ? "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
        : "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)"
      : props.darkMode
      ? "rgba(255, 255, 255, 0.1)"
      : "rgba(0, 0, 0, 0.05)"};
  color: ${(props) =>
    props.primary ? "#ffffff" : props.darkMode ? "#ffffff" : "#1e293b"};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
`;

const Badge = styled.span`
  background: ${(props) =>
    props.darkMode ? "#ef4444" : "#dc2626"};
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: 2px solid ${(props) =>
    props.darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"};
  background: ${(props) =>
    props.darkMode
      ? "rgba(255, 255, 255, 0.05)"
      : "rgba(255, 255, 255, 0.9)"};
  color: ${(props) => (props.darkMode ? "#ffffff" : "#1e293b")};
  font-size: 1rem;
  margin-top: 8px;

  &:focus {
    outline: none;
    border-color: ${(props) =>
      props.darkMode ? "#3b82f6" : "#4f46e5"};
  }
`;

const Settings = () => {
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [language, setLanguage] = useState("en");
  const [timezone, setTimezone] = useState("UTC");
  const [autoSave, setAutoSave] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [dataRetention, setDataRetention] = useState("30");
  const [showSidebar, setShowSidebar] = useState(true);

  const handleSave = () => {
    // Implement settings save functionality
    alert("Settings saved successfully!");
  };

  return (
    <Layout darkMode={darkMode}>
      <Sidebar />
      <Content>
        <Title darkMode={darkMode}>Settings</Title>
        <SettingsGrid>
          {/* Appearance Settings */}
          <SettingsCard darkMode={darkMode}>
            <CardHeader darkMode={darkMode}>
              <CardIcon><FiLayout /></CardIcon>
              <CardTitle>Appearance</CardTitle>
            </CardHeader>
            <CardBody>
              <SettingItem darkMode={darkMode}>
                <SettingLabel>
                  <SettingName>Dark Mode</SettingName>
                  <SettingDescription darkMode={darkMode}>Toggle dark/light theme</SettingDescription>
                </SettingLabel>
                <Switch>
                  <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} />
                  <Slider darkMode={darkMode} />
                </Switch>
              </SettingItem>
              <SettingItem darkMode={darkMode}>
                <SettingLabel>
                  <SettingName>Show Sidebar</SettingName>
                  <SettingDescription darkMode={darkMode}>Toggle sidebar visibility</SettingDescription>
                </SettingLabel>
                <Switch>
                  <input type="checkbox" checked={showSidebar} onChange={() => setShowSidebar(!showSidebar)} />
                  <Slider darkMode={darkMode} />
                </Switch>
              </SettingItem>
            </CardBody>
          </SettingsCard>

          {/* Notification Settings */}
          <SettingsCard darkMode={darkMode}>
            <CardHeader darkMode={darkMode}>
              <CardIcon><FiBell /></CardIcon>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardBody>
              <SettingItem darkMode={darkMode}>
                <SettingLabel>
                  <SettingName>Push Notifications</SettingName>
                  <SettingDescription darkMode={darkMode}>Receive browser notifications</SettingDescription>
                </SettingLabel>
                <Switch>
                  <input type="checkbox" checked={notifications} onChange={() => setNotifications(!notifications)} />
                  <Slider darkMode={darkMode} />
                </Switch>
              </SettingItem>
              <SettingItem darkMode={darkMode}>
                <SettingLabel>
                  <SettingName>Email Notifications</SettingName>
                  <SettingDescription darkMode={darkMode}>Receive email updates</SettingDescription>
                </SettingLabel>
                <Switch>
                  <input type="checkbox" checked={emailNotifications} onChange={() => setEmailNotifications(!emailNotifications)} />
                  <Slider darkMode={darkMode} />
                </Switch>
              </SettingItem>
            </CardBody>
          </SettingsCard>

          {/* Localization Settings */}
          <SettingsCard darkMode={darkMode}>
            <CardHeader darkMode={darkMode}>
              <CardIcon><FiGlobe /></CardIcon>
              <CardTitle>Localization</CardTitle>
            </CardHeader>
            <CardBody>
              <SettingItem darkMode={darkMode}>
                <SettingLabel>
                  <SettingName>Language</SettingName>
                  <SettingDescription darkMode={darkMode}>Select your preferred language</SettingDescription>
                </SettingLabel>
                <Select darkMode={darkMode} value={language} onChange={(e) => setLanguage(e.target.value)}>
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </Select>
              </SettingItem>
              <SettingItem darkMode={darkMode}>
                <SettingLabel>
                  <SettingName>Time Zone</SettingName>
                  <SettingDescription darkMode={darkMode}>Select your time zone</SettingDescription>
                </SettingLabel>
                <Select darkMode={darkMode} value={timezone} onChange={(e) => setTimezone(e.target.value)}>
                  <option value="UTC">UTC</option>
                  <option value="EST">EST</option>
                  <option value="PST">PST</option>
                  <option value="IST">IST</option>
                </Select>
              </SettingItem>
            </CardBody>
          </SettingsCard>

          {/* Security Settings */}
          <SettingsCard darkMode={darkMode}>
            <CardHeader darkMode={darkMode}>
              <CardIcon><FiShield /></CardIcon>
              <CardTitle>Security</CardTitle>
            </CardHeader>
            <CardBody>
              <SettingItem darkMode={darkMode}>
                <SettingLabel>
                  <SettingName>Two-Factor Authentication</SettingName>
                  <SettingDescription darkMode={darkMode}>Enable 2FA for enhanced security</SettingDescription>
                </SettingLabel>
                <Switch>
                  <input type="checkbox" checked={twoFactorAuth} onChange={() => setTwoFactorAuth(!twoFactorAuth)} />
                  <Slider darkMode={darkMode} />
                </Switch>
              </SettingItem>
              <SettingItem darkMode={darkMode}>
                <SettingLabel>
                  <SettingName>Data Retention</SettingName>
                  <SettingDescription darkMode={darkMode}>Choose how long to keep your data</SettingDescription>
                </SettingLabel>
                <Select darkMode={darkMode} value={dataRetention} onChange={(e) => setDataRetention(e.target.value)}>
                  <option value="30">30 days</option>
                  <option value="60">60 days</option>
                  <option value="90">90 days</option>
                  <option value="365">1 year</option>
                </Select>
              </SettingItem>
            </CardBody>
          </SettingsCard>

          {/* Auto-Save Settings */}
          <SettingsCard darkMode={darkMode}>
            <CardHeader darkMode={darkMode}>
              <CardIcon><FiClock /></CardIcon>
              <CardTitle>Auto-Save</CardTitle>
            </CardHeader>
            <CardBody>
              <SettingItem darkMode={darkMode}>
                <SettingLabel>
                  <SettingName>Enable Auto-Save</SettingName>
                  <SettingDescription darkMode={darkMode}>Automatically save changes</SettingDescription>
                </SettingLabel>
                <Switch>
                  <input type="checkbox" checked={autoSave} onChange={() => setAutoSave(!autoSave)} />
                  <Slider darkMode={darkMode} />
                </Switch>
              </SettingItem>
            </CardBody>
          </SettingsCard>
        </SettingsGrid>

        <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
          <Button darkMode={darkMode}>Reset to Default</Button>
          <Button primary darkMode={darkMode} onClick={handleSave}>Save Changes</Button>
        </div>
      </Content>
    </Layout>
  );
};

export default Settings;
