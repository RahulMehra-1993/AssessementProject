const API_BASE_URL = import.meta.env.VITE_API_URL;

const apiConfig = {
  BASE_URL: API_BASE_URL,
  ENDPOINTS: {
    USER: "get-user-and-assessment?",
    QUESTIONS: "/generate-questions",
  },
};

export default apiConfig;
