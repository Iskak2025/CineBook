import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8085/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && token !== 'undefined' && token !== 'null') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - token is expired or invalid
      if (localStorage.getItem('token')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    } else if (error.response?.status === 403) {
      // Forbidden - user is logged in but doesn't have permissions
      console.warn('Access forbidden: You do not have permission for this action.');
    }
    return Promise.reject(error);
  }
);

// Auth
export const loginUser = (credentials) => api.post('/users/login', credentials);
export const registerUser = (userData) => api.post('/users/register', userData);

// Local Movies
export const getLocalMovies = () => api.get('/movies/get_all');
export const getLocalMovieDetails = (id) => api.get(`/movies/get/${id}`);
export const addMovie = (movieData) => api.post('/movies/add', movieData);
export const updateMovie = (id, movieData) => api.put(`/movies/update/${id}`, movieData);
export const deleteMovie = (id) => api.delete(`/movies/delete/${id}`);
export const quickReleaseMovie = (tmdbId, date, time) => 
    api.post(`/movies/quick-release/${tmdbId}`, { date, time });

// Tickets
export const bookTicket = (bookingData) => api.post('/tickets/book', bookingData);
export const getUserTickets = (userId) => api.get(`/tickets/user/${userId}`);
export const cancelTicket = (id) => api.delete(`/tickets/cancel/${id}`);

// TMDB (via Backend Proxy)
export const getTrendingMovies = () => api.get('/tmdb/popular');
export const getTopRatedMovies = () => api.get('/tmdb/top_rated');
export const getNowPlayingMovies = () => api.get('/tmdb/now_playing');
export const searchTmdbMovies = (query) => api.get(`/tmdb/search?query=${query}`);
export const getTmdbMovieDetails = (id) => api.get(`/tmdb/details/${id}`);

// Watchlist
export const addToWatchlist = (userId, movieId) => api.post(`/watchlist/${userId}/${movieId}`);
export const removeFromWatchlist = (userId, movieId) => api.delete(`/watchlist/${userId}/${movieId}`);
export const getWatchlist = (userId) => api.get(`/watchlist/user/${userId}`);

// Shows
export const getMovieShows = (movieId) => api.get(`/show/movie/${movieId}`);
export const getShowSeats = (showId) => api.get(`/show/${showId}/seats`);

// Admin - Users
export const getAllUsers = (params) => api.get('/users', { params });
export const updateUserRole = (id, role) => api.put(`/users/${id}/role`, null, { params: { role } });
export const updateUserStatus = (id, isActive) => api.put(`/users/${id}/status`, null, { params: { isActive } });
export const deleteUser = (id) => api.delete(`/users/${id}`);

// Admin - Stats
export const getAdminStats = () => api.get('/admin/stats');

export default api;
