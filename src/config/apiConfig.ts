const API_CONFIG = {
    BASE_URL: "http://localhost:5000",
    ENDPOINTS: {
      SIGNUP: "/api/auth/signup",
      LOGIN: "/api/auth/login", // Add login endpoint
    },
  };
  
  export const API_URLS = {
    SIGNUP: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SIGNUP}`,
    LOGIN: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGIN}`,
  };