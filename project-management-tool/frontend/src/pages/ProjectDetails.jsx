import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

// Styled Components
const Container = styled.div`
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  background: ${(props) => (props.darkMode ? "#1f1f1f" : "white")};
  color: ${(props) => (props.darkMode ? "#ffffff" : "#333")};
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  text-align: center;
  transition: background 0.3s ease, color 0.3s ease;
`;

const Title = styled.h2`
  font-size: 24px;
  color: ${(props) => (props.darkMode ? "#1db954" : "#0072ff")};
  margin-bottom: 10px;
`;

const Description = styled.p`
  font-size: 16px;
  line-height: 1.5;
`;

const FileContainer = styled.div`
  margin-top: 20px;
  padding: 10px;
  border: 2px dashed ${(props) => (props.darkMode ? "#1db954" : "#0072ff")};
  border-radius: 8px;
  background: ${(props) => (props.darkMode ? "#252525" : "#f9f9f9")};
`;

const FileName = styled.p`
  font-size: 14px;
  font-weight: bold;
`;

const BackButton = styled.button`
  margin-top: 20px;
  padding: 10px 15px;
  font-size: 14px;
  font-weight: bold;
  background: ${(props) => (props.darkMode ? "#1db954" : "#0072ff")};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s;
  
  &:hover {
    background: ${(props) => (props.darkMode ? "#15803d" : "#005bb5")};
  }
`;

function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");

  useEffect(() => {
    // Fetch project details from backend
    axios.get(`http://localhost:5000/api/projects/${id}`)
      .then((response) => {
        setProject(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load project details.");
        setLoading(false);
      });

    // Sync dark mode state
    const handleStorageChange = () => {
      setDarkMode(localStorage.getItem("darkMode") === "true");
    };
    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, [id]);

  return (
    <Container darkMode={darkMode}>
      {loading ? <p>Loading project...</p> : error ? <p>{error}</p> : (
        <>
          <Title darkMode={darkMode}>{project.title}</Title>
          <Description>{project.description}</Description>
          
          {/* File Display */}
          {project.fileName && (
            <FileContainer darkMode={darkMode}>
              <FileName>📁 {project.fileName}</FileName>
            </FileContainer>
          )}

          <BackButton darkMode={darkMode} onClick={() => window.history.back()}>⬅ Back</BackButton>
        </>
      )}
    </Container>
  );
}

export default ProjectDetails;
