import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from 'chart.js';
import Sidebar from "../components/Sidebar";
import DarkModeContext from "../context/DarkModeContext";
import { useContext } from "react";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(-100px); }
  to { opacity: 1; transform: translateX(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Styled Components
const Layout = styled.div`
  display: flex;
  height: 100vh;
  background: ${(props) =>
    props.darkMode
      ? "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)"
      : "linear-gradient(135deg, #f6f9fc 0%, #e9ecef 100%)"};
  color: ${(props) => (props.darkMode ? "#ffffff" : "#333")};
  transition: background 0.3s ease;
`;

const Content = styled.div`
  flex: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: ${fadeIn} 0.6s ease-out;

  h1 {
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
  }

  p {
    font-size: 1.2rem;
    color: ${(props) => (props.darkMode ? "#94a3b8" : "#64748b")};
    text-align: center;
    max-width: 600px;
    line-height: 1.6;
  }
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
  width: 100%;
  padding: 16px;
  margin: 0 auto;
  max-width: 1200px;
`;

const ChartContainer = styled.div`
  background: ${(props) =>
    props.darkMode
      ? "linear-gradient(145deg, #1e293b 0%, #0f172a 100%)"
      : "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)"};
  border-radius: 20px;
  padding: 24px;
  box-shadow: ${(props) =>
    props.darkMode
      ? "0 8px 32px rgba(0, 0, 0, 0.3)"
      : "0 8px 32px rgba(0, 0, 0, 0.1)"};
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid ${(props) =>
    props.darkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)"};

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${(props) =>
      props.darkMode
        ? "0 12px 40px rgba(0, 0, 0, 0.4)"
        : "0 12px 40px rgba(0, 0, 0, 0.15)"};
  }
`;

const ChartTitle = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  color: ${(props) => (props.darkMode ? "#ffffff" : "#1e293b")};
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.5px;
  position: relative;
  padding-bottom: 12px;

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 3px;
    border-radius: 2px;
    background: ${(props) =>
      props.darkMode
        ? "linear-gradient(90deg, #9333ea 0%, #4f46e5 100%)"
        : "linear-gradient(90deg, #4f46e5 0%, #6366f1 100%)"};
  }
`;

const StatsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 24px;
  padding: 16px;
  background: ${(props) =>
    props.darkMode
      ? "rgba(255, 255, 255, 0.03)"
      : "rgba(0, 0, 0, 0.02)"};
  border-radius: 12px;
  border: 1px solid ${(props) =>
    props.darkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)"};
`;

const StatItem = styled.div`
  text-align: center;
  padding: 12px 24px;
  border-radius: 12px;
  background: ${(props) =>
    props.darkMode
      ? "linear-gradient(145deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)"
      : "linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)"};
  box-shadow: ${(props) =>
    props.darkMode
      ? "0 4px 12px rgba(0, 0, 0, 0.2)"
      : "0 4px 12px rgba(0, 0, 0, 0.05)"};
  border: 1px solid ${(props) =>
    props.darkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)"};
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }

  h3 {
    font-size: 1.8rem;
    font-weight: 700;
    color: ${(props) => props.color};
    margin-bottom: 6px;
    text-shadow: ${(props) =>
      props.darkMode
        ? "0 2px 4px rgba(0, 0, 0, 0.3)"
        : "0 2px 4px rgba(0, 0, 0, 0.1)"};
  }

  p {
    color: ${(props) => (props.darkMode ? "#94a3b8" : "#64748b")};
    font-size: 0.9rem;
    font-weight: 500;
    letter-spacing: 0.5px;
  }
`;

const FloatingAddButton = styled.button`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 65px;
  height: 65px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
  color: white;
  font-size: 32px;
  cursor: pointer;
  box-shadow: 0 6px 16px rgba(234, 88, 12, 0.4);
  transition: all 0.3s ease-in-out;
  animation: ${pulse} 2s infinite ease-in-out;

  &:hover {
    transform: scale(1.1);
    background: linear-gradient(135deg, #fb923c 0%, #f97316 100%);
    box-shadow: 0 8px 20px rgba(234, 88, 12, 0.5);
  }
`;

function Dashboard() {
  const navigate = useNavigate();
  const { darkMode } = useContext(DarkModeContext);
  const [taskStats, setTaskStats] = useState({
    completed: 0,
    pending: 0,
    dailyTasks: []
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/darkmode")
      .then((res) => res.json())
      .then((data) => setDarkMode(data.darkMode))
      .catch((err) => console.error("Error fetching dark mode:", err));
    
    fetchTaskStats();
  }, []);

  const fetchTaskStats = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/tasks");
      const tasks = await response.json();
      
      const completed = tasks.filter(task => task.completed).length;
      const pending = tasks.length - completed;
      
      // Get last 7 days
      const dates = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      }).reverse();

      // Count tasks for each day
      const dailyTaskCounts = dates.map(date => {
        return tasks.filter(task => task.createdAt.startsWith(date)).length;
      });

      setTaskStats({
        completed,
        pending,
        dailyTasks: {
          dates,
          counts: dailyTaskCounts
        }
      });
    } catch (error) {
      console.error("Error fetching task statistics:", error);
    }
  };

  const chartData = {
    labels: ['Completed Tasks', 'Pending Tasks'],
    datasets: [
      {
        data: [taskStats.completed, taskStats.pending],
        backgroundColor: [
          'rgba(52, 211, 153, 0.8)',  // Green for completed
          'rgba(251, 146, 60, 0.8)',  // Orange for pending
        ],
        borderColor: [
          'rgba(52, 211, 153, 1)',
          'rgba(251, 146, 60, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: darkMode ? '#ffffff' : '#1e293b',
          font: {
            size: 14,
            weight: '500'
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      }
    },
    animation: {
      duration: 2000,
      easing: 'easeOutQuart'
    }
  };

  const lineChartData = {
    labels: taskStats.dailyTasks?.dates?.map(date => {
      const [year, month, day] = date.split('-');
      return `${day}/${month}`;
    }) || [],
    datasets: [
      {
        label: 'Tasks Added',
        data: taskStats.dailyTasks?.counts || [],
        borderColor: darkMode ? 'rgba(147, 51, 234, 0.8)' : 'rgba(79, 70, 229, 0.8)',
        backgroundColor: darkMode ? 'rgba(147, 51, 234, 0.2)' : 'rgba(79, 70, 229, 0.2)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: darkMode ? '#ffffff' : '#1e293b',
          font: {
            size: 14,
            weight: '500'
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      title: {
        display: true,
        text: 'Tasks Added (Last 7 Days)',
        color: darkMode ? '#ffffff' : '#1e293b',
        font: {
          size: 16,
          weight: '700',
          lineHeight: 1.5
        },
        padding: { bottom: 20 }
      },
      tooltip: {
        backgroundColor: darkMode ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)',
        titleColor: darkMode ? '#ffffff' : '#1e293b',
        bodyColor: darkMode ? '#cbd5e1' : '#475569',
        borderColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        titleFont: {
          size: 14,
          weight: '600'
        },
        bodyFont: {
          size: 13
        },
        callbacks: {
          title: (context) => {
            const dateIndex = context[0].dataIndex;
            return `Date: ${taskStats.dailyTasks?.dates[dateIndex]}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
        },
        ticks: {
          color: darkMode ? '#cbd5e1' : '#475569',
          font: {
            size: 12,
            weight: '500'
          },
          padding: 8
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
        },
        ticks: {
          color: darkMode ? '#cbd5e1' : '#475569',
          font: {
            size: 12,
            weight: '500'
          },
          padding: 8,
          stepSize: 1
        }
      }
    },
    elements: {
      line: {
        tension: 0.4
      },
      point: {
        radius: 6,
        hoverRadius: 8,
        borderWidth: 2,
        hoverBorderWidth: 3
      }
    },
    animation: {
      duration: 2000,
      easing: 'easeOutQuart'
    }
  };

  return (
    <Layout darkMode={darkMode}>
      <Sidebar />
      <Content darkMode={darkMode}>
        <h1>Task Overview</h1>
        <ChartsGrid>
          <ChartContainer darkMode={darkMode}>
            <ChartTitle darkMode={darkMode}>Task Progress</ChartTitle>
            <div style={{ height: '250px', position: 'relative' }}>
              <Pie data={chartData} options={chartOptions} />
            </div>
            <StatsContainer darkMode={darkMode}>
              <StatItem darkMode={darkMode} color="#34D399">
                <h3>{taskStats.completed}</h3>
                <p>Completed</p>
              </StatItem>
              <StatItem darkMode={darkMode} color="#FB923C">
                <h3>{taskStats.pending}</h3>
                <p>Pending</p>
              </StatItem>
            </StatsContainer>
          </ChartContainer>

          <ChartContainer darkMode={darkMode}>
            <ChartTitle darkMode={darkMode}>Task Activity</ChartTitle>
            <div style={{ height: '250px', position: 'relative' }}>
              <Line data={lineChartData} options={lineChartOptions} />
            </div>
            <StatsContainer darkMode={darkMode}>
              <StatItem darkMode={darkMode} color={darkMode ? '#9333EA' : '#4F46E5'}>
                <h3>{taskStats.dailyTasks?.counts?.reduce((a, b) => a + b, 0) || 0}</h3>
                <p>Tasks Added (7 Days)</p>
              </StatItem>
            </StatsContainer>
          </ChartContainer>
        </ChartsGrid>
      </Content>

      <FloatingAddButton onClick={() => navigate("/tasks")}>
        +
      </FloatingAddButton>
    </Layout>
  );
}

export default Dashboard;
