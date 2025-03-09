import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const PageContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  background: ${props => props.darkMode 
    ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
    : 'linear-gradient(135deg, #f6f9fc 0%, #eef2f5 100%)'};
  color: ${props => props.darkMode ? '#fff' : '#333'};
  position: relative;
  z-index: 1;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  background: ${props => props.darkMode 
    ? 'linear-gradient(to right, #fff, #ccc)'
    : 'linear-gradient(to right, #2c3e50, #3498db)'};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
`;

const Form = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  justify-content: center;
  background: ${props => props.darkMode 
    ? 'linear-gradient(145deg, #2d2d2d, #353535)'
    : 'linear-gradient(145deg, #ffffff, #f8f9fa)'};
  padding: 2rem;
  border-radius: 15px;
  box-shadow: ${props => props.darkMode 
    ? '0 8px 32px rgba(0, 0, 0, 0.3)'
    : '0 8px 32px rgba(0, 0, 0, 0.1)'};
  backdrop-filter: blur(4px);
`;

const Input = styled.input`
  padding: 1rem;
  border: 2px solid ${props => props.darkMode ? '#444' : '#e1e1e1'};
  border-radius: 8px;
  font-size: 1rem;
  background: ${props => props.darkMode ? '#333' : '#fff'};
  color: ${props => props.darkMode ? '#fff' : '#333'};
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
  }
`;

const Button = styled.button`
  padding: 1rem 2rem;
  background: linear-gradient(to right, #3498db, #2980b9, #3498db);
  background-size: 200% auto;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background-position: right center;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(52, 152, 219, 0.4);
  }

  &:disabled {
    background: linear-gradient(to right, #ccc, #999);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

// const TeamMemberCard = styled.li`
//   background: ${props => props.darkMode 
//     ? 'linear-gradient(145deg, #2d2d2d, #353535)'
//     : 'linear-gradient(145deg, #ffffff, #f8f9fa)'};
//   padding: 1.5rem;
//   border-radius: 15px;
//   box-shadow: ${props => props.darkMode 
//     ? '0 4px 15px rgba(255, 255, 255, 0.1)'
//     : '0 4px 15px rgba(0, 0, 0, 0.1)'};
//   display: flex;
//   flex-direction: column;
//   gap: 0.5rem;
//   transition: all 0.3s ease;
//   border: 1px solid ${props => props.darkMode ? '#444' : '#e1e1e1'};

//   &:hover {
//     transform: translateY(-5px);
//     box-shadow: ${props => props.darkMode 
//       ? '0 8px 25px rgba(255, 255, 255, 0.15)'
//       : '0 8px 25px rgba(0, 0, 0, 0.15)'};
//   }

//   h3 {
//     color: ${props => props.darkMode ? '#3498db' : '#2980b9'};
//     font-size: 1.2rem;
//     margin-bottom: 0.5rem;
//   }

//   p {
//     color: ${props => props.darkMode ? '#ccc' : '#666'};
//     font-size: 1rem;
//   }
// `;

const ErrorMessage = styled.div`
  color: #e74c3c;
  text-align: center;
  margin: 1rem 0;
`;

const TeamList = styled.ul`
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
`;

// const TeamMemberCard = styled.li`
//   background: ${props => props.darkMode ? '#2d2d2d' : '#fff'};
//   padding: 1.5rem;
//   border-radius: 10px;
//   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
//   display: flex;
//   flex-direction: column;
//   gap: 0.5rem;
//   transition: transform 0.2s;

//   &:hover {
//     transform: translateY(-5px);
//   }
// `;

// Add these styled components after your existing styled components
const Layout = styled.div`
  display: flex;
  min-height: 100vh;
`;

// Update these styled components
const Sidebar = styled.div`
  width: 250px;
  background: ${props => props.darkMode 
    ? 'linear-gradient(180deg, #1f1f1f 0%, #2d2d2d 100%)'
    : 'linear-gradient(180deg, #007bff 0%, #0056b3 100%)'};
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: ${props => props.darkMode 
    ? '4px 0 10px rgba(0, 0, 0, 0.5)'
    : '4px 0 10px rgba(0, 0, 0, 0.1)'};
`;

const SidebarButton = styled.button`
  width: 100%;
  padding: 12px;
  margin: 8px 0;
  border: none;
  border-radius: 8px;
  background: ${props => props.darkMode 
    ? 'linear-gradient(145deg, #333 0%, #2a2a2a 100%)'
    : 'linear-gradient(145deg, #0051cc 0%, #003ea5 100%)'};
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;

  &:hover {
    transform: scale(1.05);
    background: ${props => props.darkMode 
      ? 'linear-gradient(145deg, #444 0%, #333 100%)'
      : 'linear-gradient(145deg, #003ea5 0%, #00308f 100%)'};
  }

  svg, img {
    width: 20px;
    height: 20px;
  }
`;

const SidebarTitle = styled.h2`
  color: white;
  margin-bottom: 20px;
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
  background: ${props => props.darkMode 
    ? 'linear-gradient(45deg, #fff, #ccc)'
    : 'linear-gradient(45deg, #fff, #e6e6e6)'};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const MainContent = styled.div`
  flex: 1;
  padding: 2rem;
  background: ${props => props.darkMode 
    ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
    : 'linear-gradient(135deg, #f6f9fc 0%, #eef2f5 100%)'};
`;

// Update the return statement in your component
const TeamMemberManagement = ({ darkMode = false }) => {
  const navigate = useNavigate(); // Add this at the top with your other imports
  const [teamMembers, setTeamMembers] = useState([]);
  const [newMember, setNewMember] = useState({ name: '', role: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchData = async () => {
      if (!mounted) return;
      
      try {
        const response = await axios.get('/api/team-members');
        if (mounted) {
          setTeamMembers(response.data || []);
        }
      } catch (err) {
        if (mounted) {
          setError('Failed to load team members');
          console.error('Error:', err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      setMounted(false);
    };
  }, []);

  const addTeamMember = async () => {
    if (!mounted) return;
    
    if (!newMember.name || !newMember.role || !newMember.email) {
      setError('All fields are required.');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const tempId = Date.now().toString();
      const addedMember = { ...newMember, id: tempId };
      
      setTeamMembers(prev => [...prev, addedMember]);
      
      if (mounted) {
        const response = await axios.post('/api/team-members', newMember);
        setTeamMembers(prev => 
          prev.map(member => 
            member.id === tempId ? { ...response.data, id: response.data._id } : member
          )
        );
        setNewMember({ name: '', role: '', email: '' });
      }
    } catch (error) {
      if (mounted) {
        setError('Error adding team member');
        console.error('Error:', error);
      }
    } finally {
      if (mounted) {
        setLoading(false);
      }
    }
  };

  return (
    <Layout>
      <Sidebar darkMode={darkMode}>
        <h2 style={{ color: 'white', marginBottom: '1rem', textAlign: 'center' }}>
          📊 Dashboard
        </h2>
        <SidebarButton darkMode={darkMode} onClick={() => navigate('/dashboard')}>
          🏠 Home
        </SidebarButton>
        <SidebarButton darkMode={darkMode} onClick={() => navigate('/projects')}>
          📁 Projects
        </SidebarButton>
        <SidebarButton darkMode={darkMode} onClick={() => navigate('/tasks')}>
          ✅ Tasks
        </SidebarButton>
        <SidebarButton darkMode={darkMode} onClick={() => navigate('/team-members')}>
          👥 Team Members
        </SidebarButton>
        <SidebarButton darkMode={darkMode} onClick={() => navigate('/settings')}>
          ⚙️ Settings
        </SidebarButton>
      </Sidebar>

      <MainContent darkMode={darkMode}>
        <Title darkMode={darkMode}>Team Member Management</Title>

        <Form darkMode={darkMode}>
          <Input
            type="text"
            placeholder="Name"
            value={newMember.name}
            onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
            darkMode={darkMode}
          />
          <Input
            type="text"
            placeholder="Role"
            value={newMember.role}
            onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
            darkMode={darkMode}
          />
          <Input
            type="email"
            placeholder="Email"
            value={newMember.email}
            onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
            darkMode={darkMode}
          />
          <Button onClick={addTeamMember} disabled={loading}>
            {loading ? 'Adding...' : 'Add Member'}
          </Button>
        </Form>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        {loading ? (
          <p>Loading team members...</p>
        ) : (
          <TeamList>
            {teamMembers.length > 0 ? (
              teamMembers.map((member) => (
                <TeamMemberCard key={member.id} darkMode={darkMode}>
                  <h3>{member.name}</h3>
                  <p>{member.role}</p>
                  <p>{member.email}</p>
                </TeamMemberCard>
              ))
            ) : (
              <p>No team members found.</p>
            )}
          </TeamList>
        )}
      </MainContent>
    </Layout>
  );
};

export default TeamMemberManagement;
