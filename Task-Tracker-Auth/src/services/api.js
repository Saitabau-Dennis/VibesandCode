import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// User API calls
export const userAPI = {
  // Get user by email
  getUserByEmail: (email) => api.get(`/users?email=${email}`),
  
  // Create new user
  createUser: (userData) => api.post('/users', userData),
  
  // Get user by ID
  getUserById: (id) => api.get(`/users/${id}`),
};

// Task API calls
export const taskAPI = {
  // Get tasks for a user
  getUserTasks: (userId) => api.get(`/tasks?userId=${userId}`),
  
  // Create new task
  createTask: (taskData) => api.post('/tasks', taskData),
  
  // Update task
  updateTask: (taskId, taskData) => api.put(`/tasks/${taskId}`, taskData),
  
  // Delete task
  deleteTask: (taskId) => api.delete(`/tasks/${taskId}`),
  
  // Get all tasks
  getAllTasks: () => api.get('/tasks'),
};

export default api;
