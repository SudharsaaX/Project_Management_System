import axios from 'axios';

// Get API base URL from .env file
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, 
});

// Example: Fetch all projects
export const fetchProjects = async () => {
  try {
    const response = await API.get('/projects');
    return response.data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return null;
  }
};

export default API;
