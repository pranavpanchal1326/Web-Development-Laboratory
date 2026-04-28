import axios from 'axios';

// We are hardcoding the backend URL to ensure a stable connection.
const API_URL = 'http://localhost:5000/api/applications/';

// Create new leave application
const createApplication = async (applicationData, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.post(API_URL, applicationData, config);
  return response.data;
};
    
// Get user applications
const getApplications = async (token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.get(API_URL, config);
  return response.data;
};

// Get ALL applications (for staff)
const getAllApplications = async (token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.get(API_URL + 'all', config);
  return response.data;
};

// Update application status (for staff)
const updateApplicationStatus = async (applicationId, statusData, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.put(API_URL + applicationId, statusData, config);
  return response.data;
};

// Get application statistics (for admin)
const getApplicationStats = async (token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.get(API_URL + 'stats', config);
  return response.data;
};

// Get single application by ID
const getApplicationById = async (applicationId, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.get(API_URL + applicationId, config);
  return response.data;
};

// Delete application
const deleteApplication = async (applicationId, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.delete(API_URL + applicationId, config);
  return response.data;
};

const applicationService = {
  createApplication,
  getApplications,
  getAllApplications,
  updateApplicationStatus,
  getApplicationStats,
  getApplicationById,
  deleteApplication,
};

export default applicationService;
