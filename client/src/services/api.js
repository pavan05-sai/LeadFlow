import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('crm_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('crm_token');
      localStorage.removeItem('crm_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ---- Auth ----
export const loginAdmin = (credentials) => API.post('/auth/login', credentials);
export const getMe = () => API.get('/auth/me');

// ---- Leads ----
export const getLeads = (params) => API.get('/leads', { params });
export const getLeadById = (id) => API.get(`/leads/${id}`);
export const createLead = (data) => API.post('/leads', data);
export const updateLead = (id, data) => API.put(`/leads/${id}`, data);
export const deleteLead = (id) => API.delete(`/leads/${id}`);

// ---- Users (Admin) ----
export const getUsers = () => API.get('/users');
export const createUser = (data) => API.post('/users', data);
export const deleteUser = (id) => API.delete(`/users/${id}`);

// ---- Notes ----
export const addNote = (leadId, data) => API.post(`/leads/${leadId}/notes`, data);
export const getNotes = (leadId) => API.get(`/leads/${leadId}/notes`);

// ---- Reports ----
export const getMonthlyReports = () => API.get('/leads/reports/monthly');

export default API;
