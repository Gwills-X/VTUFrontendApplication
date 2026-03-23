import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { status } = error.response;

    if (status === 401) {
      // TOKEN EXPIRED (10 mins over)
      localStorage.removeItem("token");
      localStorage.removeItem("user_role"); // Clean up role too
      window.location.href = "/login?session=expired";
    }

    if (status === 403) {
      // WRONG ROLE (User trying to be Admin)
      alert("You do not have permission to access this area.");
      window.location.href = "/user/dashboard";
    }

    return Promise.reject(error);
  },
);

export default api;
