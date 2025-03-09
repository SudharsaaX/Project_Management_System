import React, { useState, useContext, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import DarkModeContext from "../context/DarkModeContext";
import Sidebar from "../components/Sidebar";
import { FiPlus, FiCalendar, FiClock, FiUsers, FiTag, FiChevronLeft, FiChevronRight, FiFilter, FiTrash2, FiEdit2, FiBell, FiX, FiFileText, FiFlag } from "react-icons/fi";

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
`;

// Styled Components
const Layout = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${props =>
    props.darkMode
      ? "linear-gradient(120deg, #1a202c 0%, #2d3748 100%)"
      : "linear-gradient(120deg, #f1f5f9 0%, #e2e8f0 100%)"};
  color: ${props => props.darkMode ? "#f1f5f9" : "#1e293b"};
  font-family: "Inter", sans-serif;
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 24px;
  overflow-y: auto;
  animation: ${fadeIn} 0.5s ease;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  width: 100%;
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
  gap: 24px;
  width: 100%;
  height: calc(100vh - 120px);
  margin-bottom: 20px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    height: auto;
    gap: 20px;
  }
`;

const CalendarContainer = styled.div`
  background: ${props =>
    props.darkMode
      ? "linear-gradient(145deg, #1e293b 0%, #0f172a 100%)"
      : "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)"};
  border-radius: 16px;
  padding: 20px;
  box-shadow: ${props =>
    props.darkMode
      ? "0 10px 15px -3px rgba(0, 0, 0, 0.4)"
      : "0 10px 15px -3px rgba(0, 0, 0, 0.1)"};
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 600px;
  
  @media (max-width: 1024px) {
    min-height: 500px;
    padding: 16px;
  }
`;

const EventListContainer = styled.div`
  background: ${props =>
    props.darkMode
      ? "linear-gradient(145deg, #1e293b 0%, #0f172a 100%)"
      : "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)"};
  border-radius: 16px;
  padding: 24px;
  box-shadow: ${props =>
    props.darkMode
      ? "0 10px 15px -3px rgba(0, 0, 0, 0.4)"
      : "0 10px 15px -3px rgba(0, 0, 0, 0.1)"};
  height: 100%;
  min-height: 600px;
  display: flex;
  flex-direction: column;
  
  @media (max-width: 1024px) {
    min-height: 400px;
  }
`;

const EventList = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-right: 8px;
  margin-top: 16px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.darkMode ? "rgba(148, 163, 184, 0.1)" : "rgba(100, 116, 139, 0.1)"};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.darkMode ? "rgba(148, 163, 184, 0.3)" : "rgba(100, 116, 139, 0.3)"};
    border-radius: 4px;
    
    &:hover {
      background: ${props => props.darkMode ? "rgba(148, 163, 184, 0.4)" : "rgba(100, 116, 139, 0.4)"};
    }
  }
`;

const CalendarSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 8px 0;
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  grid-template-rows: auto repeat(6, minmax(45px, 1fr));
  gap: 6px;
  flex: 1;
  margin-top: 12px;
  
  @media (max-width: 768px) {
    gap: 4px;
    grid-template-rows: auto repeat(6, minmax(35px, 1fr));
  }
`;

const WeekDay = styled.div`
  text-align: center;
  font-weight: 600;
  font-size: 0.9rem;
  color: ${props => props.darkMode ? "#94a3b8" : "#64748b"};
  padding: 8px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 6px 0;
  }
`;

const DayCell = styled.div`
  position: relative;
  background: ${props =>
    props.darkMode
      ? props.isToday
        ? "rgba(59, 130, 246, 0.2)"
        : "rgba(30, 41, 59, 0.4)"
      : props.isToday
      ? "rgba(59, 130, 246, 0.1)"
      : "rgba(241, 245, 249, 0.6)"};
  border: 1px solid ${props =>
    props.darkMode
      ? props.isToday
        ? "rgba(59, 130, 246, 0.5)"
        : "rgba(148, 163, 184, 0.1)"
      : props.isToday
      ? "rgba(59, 130, 246, 0.2)"
      : "rgba(226, 232, 240, 0.6)"};
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 6px;
  transition: all 0.2s ease;
  
  ${props =>
    props.hasEvents &&
    `
    &::after {
      content: '';
      position: absolute;
      bottom: 6px;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: ${props.darkMode ? "#60a5fa" : "#3b82f6"};
      box-shadow: 0 0 4px ${props.darkMode ? "rgba(96, 165, 250, 0.4)" : "rgba(59, 130, 246, 0.4)"};
    }
  `}

  &:hover {
    transform: translateY(-1px);
    background: ${props =>
      props.darkMode
        ? "rgba(59, 130, 246, 0.25)"
        : "rgba(59, 130, 246, 0.15)"};
    box-shadow: 0 4px 6px -1px ${props =>
      props.darkMode
        ? "rgba(0, 0, 0, 0.2)"
        : "rgba(0, 0, 0, 0.1)"};
  }

  @media (max-width: 768px) {
    padding: 4px;
  }
`;

const DayNumber = styled.span`
  font-size: ${props => props.isToday ? "1.1rem" : "1rem"};
  font-weight: ${props => props.isToday ? "600" : "400"};
  color: ${props => props.isToday ? "#3b82f6" : "inherit"};
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: ${props => props.isToday ? "1rem" : "0.9rem"};
  }
`;

const EventCard = styled.div`
  padding: 10px;
  border-radius: 8px;
  background: ${props =>
    props.darkMode
      ? "rgba(30, 41, 59, 0.5)"
      : "rgba(241, 245, 249, 0.8)"};
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.2s ease;
  font-size: 0.9rem;

  &:hover {
    transform: translateX(3px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const EventIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: ${props =>
    props.darkMode
      ? "rgba(96, 165, 250, 0.2)"
      : "rgba(59, 130, 246, 0.1)"};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.darkMode ? "#60a5fa" : "#3b82f6"};
  font-size: 0.9rem;
`;

const EventInfo = styled.div`
  flex: 1;
`;

const EventTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
`;

const EventDetails = styled.p`
  margin: 5px 0 0;
  font-size: 0.8rem;
  color: ${props => props.darkMode ? "#94a3b8" : "#64748b"};
`;

const EventActions = styled.div`
  display: flex;
  gap: 10px;
  margin-left: auto;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.darkMode ? "#94a3b8" : "#64748b"};
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    color: ${props => props.darkMode ? "#60a5fa" : "#3b82f6"};
    background: ${props => props.darkMode ? "rgba(96, 165, 250, 0.1)" : "rgba(59, 130, 246, 0.1)"};
  }
`;

const MonthNavigation = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding: 0 4px;
`;

const MonthTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
`;

const MonthButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.darkMode ? "#94a3b8" : "#64748b"};
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props =>
      props.darkMode
        ? "rgba(148, 163, 184, 0.1)"
        : "rgba(100, 116, 139, 0.1)"};
  }
`;

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 16px;
  padding: 12px;
  border-radius: 10px;
  background: ${props =>
    props.darkMode
      ? "rgba(30, 41, 59, 0.4)"
      : "rgba(241, 245, 249, 0.6)"};
`;

const FilterChip = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 15px;
  font-size: 0.8rem;
  border: 1px solid ${props => props.active ? 
    (props.darkMode ? "#60a5fa" : "#3b82f6") : 
    (props.darkMode ? "rgba(148, 163, 184, 0.2)" : "rgba(100, 116, 139, 0.2)")};
  background: ${props => props.active ? 
    (props.darkMode ? "rgba(96, 165, 250, 0.2)" : "rgba(59, 130, 246, 0.1)") : 
    "transparent"};
  color: ${props => props.darkMode ? "#f1f5f9" : "#1e293b"};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    border-color: ${props => props.darkMode ? "#60a5fa" : "#3b82f6"};
  }
`;

const AddEventButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 15px;
  border-radius: 8px;
  font-size: 0.9rem;
  border: none;
  background: ${props =>
    props.darkMode
      ? "linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)"
      : "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)"};
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    padding: 6px 12px;
  }
`;

const Title = styled.h1`
  font-size: 1.8rem;
  background: ${props =>
    props.darkMode
      ? "linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)"
      : "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)"};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const EventListTitle = styled.h2`
  font-size: 1.2rem;
  margin-bottom: 16px;
  color: ${props => props.darkMode ? "#f1f5f9" : "#1e293b"};
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: ${props => props.darkMode ? "#1e293b" : "#ffffff"};
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 400px;
  z-index: 1000;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const ModalTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${props => props.darkMode ? "#f1f5f9" : "#1e293b"};
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.darkMode ? "#94a3b8" : "#64748b"};
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
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

const Select = styled.select`
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

const ReminderToggle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  border-radius: 4px;
  background: ${props => props.darkMode ? "#2e3f50" : "#f8fafc"};
`;

const ReminderLabel = styled.span`
  font-size: 0.9rem;
  color: ${props => props.darkMode ? "#94a3b8" : "#64748b"};
`;

const Switch = styled.label`
  position: relative;
  display: inline-block;
  width: 36px;
  height: 20px;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${props => props.darkMode ? "#475569" : "#cbd5e1"};
    transition: .2s;
    border-radius: 20px;

    &:before {
      position: absolute;
      content: "";
      height: 16px;
      width: 16px;
      left: 2px;
      bottom: 2px;
      background-color: white;
      transition: .2s;
      border-radius: 50%;
    }
  }

  input:checked + span {
    background-color: ${props => props.darkMode ? "#60a5fa" : "#3b82f6"};
  }

  input:checked + span:before {
    transform: translateX(16px);
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

function Calendar() {
  const { darkMode } = useContext(DarkModeContext);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    time: "",
    type: "meeting",
    participants: "",
    description: "",
    priority: "medium",
    reminder: false
  });
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeFilters, setActiveFilters] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date();
  const eventTypes = ["meeting", "deadline", "milestone", "task"];
  const priorities = ["low", "medium", "high"];

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    const event = {
      ...newEvent,
      id: editingEvent?.id || Date.now(),
      date: selectedDate
    };

    if (editingEvent) {
      setEvents(events.map(e => e.id === editingEvent.id ? event : e));
      setEditingEvent(null);
    } else {
      setEvents([...events, event]);
    }

    setShowModal(false);
    setNewEvent({
      title: "",
      date: "",
      time: "",
      type: "meeting",
      participants: "",
      description: "",
      priority: "medium",
      reminder: false
    });
  };

  const handleDayClick = (date) => {
    setSelectedDate(date);
    setShowModal(true);
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setSelectedDate(event.date);
    setNewEvent({
      ...event
    });
    setShowModal(true);
  };

  const handleDeleteEvent = (eventId) => {
    setEvents(events.filter(event => event.id !== eventId));
  };

  const handleMonthChange = (increment) => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + increment)));
  };

  const toggleFilter = (filter) => {
    setActiveFilters(
      activeFilters.includes(filter)
        ? activeFilters.filter(f => f !== filter)
        : [...activeFilters, filter]
    );
  };

  const filteredEvents = events.filter(event => 
    activeFilters.length === 0 || activeFilters.includes(event.type)
  );

  const hasEvents = (date) => {
    return filteredEvents.some(
      event =>
        event.date &&
        date &&
        event.date.toDateString() === date.toDateString()
    );
  };

  return (
    <Layout darkMode={darkMode}>
      <Sidebar />
      <Content darkMode={darkMode}>
        <Header>
          <Title darkMode={darkMode}>Calendar</Title>
          <AddEventButton
            darkMode={darkMode}
            onClick={() => {
              setSelectedDate(new Date());
              setShowModal(true);
            }}
          >
            <FiPlus /> Add Event
          </AddEventButton>
        </Header>

        <MainContent>
          <CalendarContainer darkMode={darkMode}>
            <MonthNavigation>
              <MonthButton darkMode={darkMode} onClick={() => handleMonthChange(-1)}>
                <FiChevronLeft />
              </MonthButton>
              <MonthTitle>
                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </MonthTitle>
              <MonthButton darkMode={darkMode} onClick={() => handleMonthChange(1)}>
                <FiChevronRight />
              </MonthButton>
            </MonthNavigation>

            <FilterContainer>
              <FiFilter style={{ marginRight: '8px' }} />
              {eventTypes.map(type => (
                <FilterChip
                  key={type}
                  darkMode={darkMode}
                  active={activeFilters.includes(type)}
                  onClick={() => toggleFilter(type)}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </FilterChip>
              ))}
            </FilterContainer>

            <CalendarSection>
              <CalendarGrid>
                {weekDays.map(day => (
                  <WeekDay key={day} darkMode={darkMode}>
                    {day}
                  </WeekDay>
                ))}
                {generateCalendarDays().map((date, index) => (
                  <DayCell
                    key={index}
                    darkMode={darkMode}
                    isToday={date && date.toDateString() === today.toDateString()}
                    hasEvents={date && hasEvents(date)}
                    onClick={() => date && handleDayClick(date)}
                  >
                    {date && (
                      <DayNumber isToday={date.toDateString() === today.toDateString()}>
                        {date.getDate()}
                      </DayNumber>
                    )}
                  </DayCell>
                ))}
              </CalendarGrid>
            </CalendarSection>
          </CalendarContainer>

          <EventListContainer darkMode={darkMode}>
            <EventListTitle darkMode={darkMode}>Upcoming Events</EventListTitle>
            <EventList darkMode={darkMode}>
              {filteredEvents.map(event => (
                <EventCard key={event.id} darkMode={darkMode}>
                  <EventIcon darkMode={darkMode}>
                    {event.type === "meeting" ? <FiUsers /> : 
                     event.type === "deadline" ? <FiClock /> :
                     event.type === "milestone" ? <FiTag /> : <FiCalendar />}
                  </EventIcon>
                  <EventInfo>
                    <EventTitle>{event.title}</EventTitle>
                    <EventDetails darkMode={darkMode}>
                      {event.date.toLocaleDateString()} at {event.time}
                      {event.priority && (
                        <span style={{ 
                          marginLeft: '10px',
                          color: event.priority === 'high' ? '#ef4444' : 
                                 event.priority === 'medium' ? '#f59e0b' : '#10b981'
                        }}>
                          • {event.priority}
                        </span>
                      )}
                    </EventDetails>
                  </EventInfo>
                  <EventActions>
                    <ActionButton
                      darkMode={darkMode}
                      onClick={() => handleEditEvent(event)}
                    >
                      <FiEdit2 />
                    </ActionButton>
                    <ActionButton
                      darkMode={darkMode}
                      onClick={() => handleDeleteEvent(event.id)}
                    >
                      <FiTrash2 />
                    </ActionButton>
                  </EventActions>
                </EventCard>
              ))}
            </EventList>
          </EventListContainer>
        </MainContent>

        {showModal && (
          <>
            <Overlay onClick={() => setShowModal(false)} />
            <Modal darkMode={darkMode}>
              <ModalHeader>
                <ModalTitle darkMode={darkMode}>
                  {editingEvent ? 'Edit Event' : 'Add New Event'}
                </ModalTitle>
                <CloseButton darkMode={darkMode} onClick={() => setShowModal(false)}>
                  <FiX size={20} />
                </CloseButton>
              </ModalHeader>
              <Form onSubmit={handleAddEvent}>
                <FormGroup>
                  <Label darkMode={darkMode}>
                    <FiFileText /> Title
                  </Label>
                  <Input
                    type="text"
                    placeholder="Enter event title"
                    value={newEvent.title}
                    onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                    darkMode={darkMode}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label darkMode={darkMode}>
                    <FiCalendar /> Date
                  </Label>
                  <Input
                    type="date"
                    value={selectedDate.toISOString().split('T')[0]}
                    onChange={e => setSelectedDate(new Date(e.target.value))}
                    darkMode={darkMode}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label darkMode={darkMode}>
                    <FiClock /> Time
                  </Label>
                  <Input
                    type="time"
                    value={newEvent.time}
                    onChange={e => setNewEvent({ ...newEvent, time: e.target.value })}
                    darkMode={darkMode}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label darkMode={darkMode}>
                    <FiTag /> Event Type
                  </Label>
                  <Select
                    value={newEvent.type}
                    onChange={e => setNewEvent({ ...newEvent, type: e.target.value })}
                    darkMode={darkMode}
                    required
                  >
                    <option value="">Select type</option>
                    {eventTypes.map(type => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label darkMode={darkMode}>
                    <FiFlag /> Priority
                  </Label>
                  <Select
                    value={newEvent.priority}
                    onChange={e => setNewEvent({ ...newEvent, priority: e.target.value })}
                    darkMode={darkMode}
                    required
                  >
                    <option value="">Select priority</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </Select>
                </FormGroup>

                <ReminderToggle darkMode={darkMode}>
                  <ReminderLabel darkMode={darkMode}>
                    <FiBell /> Enable Reminder
                  </ReminderLabel>
                  <Switch darkMode={darkMode}>
                    <input
                      type="checkbox"
                      checked={newEvent.reminder}
                      onChange={e => setNewEvent({ ...newEvent, reminder: e.target.checked })}
                    />
                    <span />
                  </Switch>
                </ReminderToggle>

                <ButtonGroup>
                  <Button
                    type="button"
                    onClick={() => setShowModal(false)}
                    darkMode={darkMode}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    primary
                    darkMode={darkMode}
                  >
                    {editingEvent ? 'Update Event' : 'Add Event'}
                  </Button>
                </ButtonGroup>
              </Form>
            </Modal>
          </>
        )}
      </Content>
    </Layout>
  );
}

export default Calendar;
