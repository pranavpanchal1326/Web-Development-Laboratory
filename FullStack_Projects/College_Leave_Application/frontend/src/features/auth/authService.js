import axios from 'axios';

// We are hardcoding the backend URL to ensure the connection works.
const API_URL = 'http://localhost:5000/api/users/';

// Register user
const register = async (userData) => {
  const response = await axios.post(API_URL + 'register', userData);

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await axios.post(API_URL + 'login', userData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

// Logout user
const logout = () => {
  localStorage.removeItem('user');
};

// Forgot Password
const forgotPassword = async (emailData) => {
  const response = await axios.post(API_URL + 'forgotpassword', emailData);
  return response.data;
};

// Reset Password
const resetPassword = async (token, passwordData) => {
  const response = await axios.patch(API_URL + `resetpassword/${token}`, passwordData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

// --- This is the new function to add ---
// Get all users (for admin)
const getAllUsers = async (token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.get(API_URL, config);
  return response.data;
};
// ------------------------------------


const authService = {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getAllUsers, // <-- Add this to the export
};

export default authService;
