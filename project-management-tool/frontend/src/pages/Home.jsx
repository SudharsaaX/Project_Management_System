import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { fetchProjects } from "../api"; // Import API function

// Styled components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(to right, #00c6ff, #0072ff);
  color: white;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
`;

const Nav = styled.nav`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StyledLink = styled(Link)`
  padding: 10px 20px;
  background: white;
  color: #0072ff;
  text-decoration: none;
  font-weight: bold;
  border-radius: 5px;
  transition: background 0.3s, color 0.3s;

  &:hover {
    background: #0072ff;
    color: white;
  }
`;

const ProjectList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 1rem;
`;

const ProjectItem = styled.li`
  background: white;
  color: #0072ff;
  padding: 10px 15px;
  margin: 5px 0;
  border-radius: 5px;
  font-weight: bold;
  text-align: center;
  width: 200px;
`;

function Home() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // Fetch projects from backend when component loads
    const getProjects = async () => {
      const data = await fetchProjects();
      if (data) setProjects(data);
    };

    getProjects();
  }, []);

  return (
    <Container>
      <Title>Welcome to Home Page</Title>

      {/* Navigation Links */}
      <Nav>
        <StyledLink to="/login">Login</StyledLink>
        <StyledLink to="/signup">Signup</StyledLink>
        <StyledLink to="/dashboard">Dashboard</StyledLink>
      </Nav>

      {/* Displaying Project List from Backend */}
      <h2>Project List</h2>
      {projects.length > 0 ? (
        <ProjectList>
          {projects.map((project) => (
            <ProjectItem key={project.id}>{project.name}</ProjectItem>
          ))}
        </ProjectList>
      ) : (
        <p>Loading projects...</p>
      )}
    </Container>
  );
}

export default Home;
