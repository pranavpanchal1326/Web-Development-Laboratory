import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import { AnimatePresence } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';

// Theme
import { createAppTheme } from "./theme/theme";// Corrected path

// Components
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import Calendar from './components/Calendar'; // Import the Calendar component

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import NewApplication from './pages/NewApplication';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import ApplicationDetail from './pages/ApplicationDetail';
import Profile from './pages/profile';
import UserManagement from './pages/UserManagement';
import AdminDashboard from './pages/AdminDashboard'; // This will be our Analytics page

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  const theme = createAppTheme(darkMode ? 'dark' : 'light');

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    document.body.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          
          <AnimatePresence mode="wait">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgotpassword" element={<ForgotPassword />} />
              <Route path="/resetpassword/:token" element={<ResetPassword />} />
              
              {/* Protected Routes */}
              <Route path="/" element={<PrivateRoute />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/new-application" element={<NewApplication />} />
                <Route path="/application/:id" element={<ApplicationDetail />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/admin/users" element={<UserManagement />} />
                <Route path="/analytics" element={<AdminDashboard />} />
                {/* We need a page for the calendar route */}
                <Route path="/calendar" element={
                  <div style={{padding: '2rem'}}>
                    {/* For now, we render the calendar component directly.
                        We can create a dedicated CalendarPage.jsx later if needed. */}
                    <Calendar applications={[]} /> 
                  </div>
                } />
              </Route>
            </Routes>
          </AnimatePresence>
          
          <ToastContainer
            position="top-right"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme={darkMode ? 'dark' : 'light'}
            toastStyle={{
              borderRadius: '12px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            }}
          />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
