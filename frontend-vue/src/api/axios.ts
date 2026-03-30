import axios from 'axios';

// Create an Axios instance configured to talk to the Express backend
const instance = axios.create({
  baseURL: 'http://localhost:8000/api', // Maps to the Express backend server
  withCredentials: true, // Necessary if sending cookies across CORS
});

// Request interceptor to attach JWT if we store it locally (if not relying entirely on HTTP-only cookies)
instance.interceptors.request.use(
  (config) => {
    // If you decide to store JWT in localStorage instead of HTTP-only cookies:
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle global errors (e.g., redirect to login on 401)
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized (clear session, redirect to login, etc)
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default instance;
