import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getUsers: () => api.get('/auth/users'),
  deleteUser: (id) => api.delete(`/auth/users/${id}`),
  changeUserRole: (id, role) => api.put(`/auth/users/${id}/role?role=${role}`),
  changeUserPassword: (id, password) => api.put(`/auth/users/${id}/password?password=${password}`),
  updateUser: (id, userData) => api.put(`/auth/users/${id}`, userData)
};

export const restaurantAPI = {
  getAll: () => api.get('/restaurants'),
  getMy: () => api.get('/restaurants/my'),
  add: (restaurant) => api.post('/restaurants/add', restaurant),
  adminAdd: (restaurant) => api.post('/restaurants/admin/add', restaurant),
  adminUpdate: (id, restaurant) => api.put(`/restaurants/admin/${id}`, restaurant),
  adminDelete: (id) => api.delete(`/restaurants/admin/${id}`),
  delete: (id) => api.delete(`/restaurants/my/${id}`),
  updateAvailability: (id, available) => api.put(`/restaurants/my/${id}/availability?available=${available}`),
  getAvailability: (id, date, time) => api.get(`/restaurants/${id}/availability?date=${date}&time=${time}`),
  searchByLocation: (location) => api.get(`/restaurants/search/location?location=${location}`),
  searchByCuisine: (cuisine) => api.get(`/restaurants/search/cuisine?cuisine=${cuisine}`)
};

export const reservationAPI = {
  book: (reservation) => api.post('/reservations/book', reservation),
  getMy: () => api.get('/reservations/my'),
  getForRestaurant: (id) => api.get(`/reservations/restaurant/${id}`),
  updateStatus: (id, status) => api.put(`/reservations/${id}/status?status=${status}`),
  cancel: (id) => api.put(`/reservations/${id}/status?status=CANCELLED`)
};

export default api;