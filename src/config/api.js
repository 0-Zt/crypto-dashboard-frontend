// Check for different environment variable patterns
const getApiUrl = () => {
  // Try to get the URL from environment variables first
  if (process.env.REACT_APP_API_URL) {
    console.log('Using REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
    return process.env.REACT_APP_API_URL;
  }
  const envVite = import.meta?.env;
  if (envVite?.VITE_API_URL) {
    console.log('Using VITE_API_URL:', envVite.VITE_API_URL);
    return envVite.VITE_API_URL;
  }
  
  // If no environment variable is set, use the Railway deployment URL
  const railwayUrl = 'https://crypto-dashboard-backend-883w.onrender.com';
  console.log('Using Render URL:', railwayUrl);
  return railwayUrl;
};

export const API_URL = getApiUrl();

// Helper function to make API calls with proper error handling
export const fetchApi = async (endpoint) => {
  const url = `${API_URL}${endpoint}`;
  console.log('Fetching from:', url);
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};
