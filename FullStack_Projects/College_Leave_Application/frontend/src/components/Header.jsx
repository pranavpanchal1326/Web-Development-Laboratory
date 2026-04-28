import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Box,
  Switch,
  Badge,
  useTheme,
  useMediaQuery,
  Divider,
} from '@mui/material';
import {
  Brightness4,
  Brightness7,
  School,
  NotificationsNone,
  Dashboard,
  ExitToApp,
  Settings,
  Person,
  Analytics,
  CalendarMonth,
} from '@mui/icons-material';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import authService from '../features/auth/authService';

const Header = ({ darkMode, toggleDarkMode }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationCount] = useState(3);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isLoggedIn = !!user.token;

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
    handleMenuClose();
  };

  const headerVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
        mass: 0.5,
      },
    },
  };

  const logoVariants = {
    hover: {
      scale: 1.05,
      rotate: [0, -3, 3, 0],
      transition: {
        duration: 0.6,
        ease: 'easeInOut',
      },
    },
  };

  const menuVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: -20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 20,
      },
    },
  };

  // Create gradient strings to avoid template literal issues
  const logoGradient = `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`;
  const titleGradient = `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`;
  const badgeGradient = `linear-gradient(135deg, ${theme.palette.error.main}, ${theme.palette.error.light})`;
  const avatarGradient = `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`;
  const buttonGradient = `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`;

  return (
    <Motion.div
      variants={headerVariants}
      initial="hidden"
      animate="visible"
    >
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: darkMode
            ? 'rgba(30, 41, 59, 0.8)'
            : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px) saturate(180%)',
          borderBottom: `1px solid ${
            darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
          }`,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Toolbar
          sx={{
            justifyContent: 'space-between',
            py: 1,
            px: { xs: 2, md: 4 },
          }}
        >
          {/* Logo Section */}
          <Motion.div variants={logoVariants} whileHover="hover">
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                cursor: 'pointer',
              }}
              onClick={() => navigate('/')}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '12px',
                  background: logoGradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 32px rgba(30, 64, 175, 0.3)',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: '-2px',
                    borderRadius: '14px',
                    padding: '2px',
                    background: logoGradient,
                    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    maskComposite: 'exclude',
                  },
                }}
              >
                <School sx={{ color: 'white', fontSize: 28 }} />
              </Box>
              {!isMobile && (
                <Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      background: titleGradient,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      lineHeight: 1.2,
                    }}
                  >
                    EduLeave Pro
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: theme.palette.text.secondary,
                      fontWeight: 500,
                      letterSpacing: '0.5px',
                    }}
                  >
                    Smart Leave Management
                  </Typography>
                </Box>
              )}
            </Box>
          </Motion.div>

          {/* Right Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Theme Toggle */}
            <Motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  background: darkMode
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(0, 0, 0, 0.05)',
                  borderRadius: '12px',
                  p: 1,
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${
                    darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                  }`,
                }}
              >
                <Brightness7 sx={{ fontSize: 20, opacity: darkMode ? 0.5 : 1 }} />
                <Switch
                  checked={darkMode}
                  onChange={toggleDarkMode}
                  size="small"
                  sx={{
                    '& .MuiSwitch-thumb': {
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    },
                  }}
                />
                <Brightness4 sx={{ fontSize: 20, opacity: darkMode ? 1 : 0.5 }} />
              </Box>
            </Motion.div>

            {isLoggedIn && (
              <>
                {/* Notifications */}
                <Motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <IconButton
                    sx={{
                      background: darkMode
                        ? 'rgba(255, 255, 255, 0.1)'
                        : 'rgba(0, 0, 0, 0.05)',
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${
                        darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                      }`,
                      '&:hover': {
                        background: theme.palette.primary.main + '20',
                      },
                    }}
                  >
                    <Badge
                      badgeContent={notificationCount}
                      sx={{
                        '& .MuiBadge-badge': {
                          background: badgeGradient,
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '0.7rem',
                        },
                      }}
                    >
                      <NotificationsNone />
                    </Badge>
                  </IconButton>
                </Motion.div>

                {/* User Menu */}
                <Motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      cursor: 'pointer',
                      background: darkMode
                        ? 'rgba(255, 255, 255, 0.1)'
                        : 'rgba(0, 0, 0, 0.05)',
                      borderRadius: '12px',
                      p: 1,
                      pr: 2,
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${
                        darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                      }`,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        background: theme.palette.primary.main + '20',
                      },
                    }}
                    onClick={handleMenuOpen}
                  >
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        background: avatarGradient,
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                      }}
                    >
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </Avatar>
                    {!isMobile && (
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, lineHeight: 1.2 }}
                        >
                          {user.name || 'User'}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: theme.palette.text.secondary,
                            fontSize: '0.7rem',
                            textTransform: 'capitalize',
                          }}
                        >
                          {user.role || 'Student'}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Motion.div>

                {/* Enhanced User Menu Dropdown */}
                <AnimatePresence>
                  {Boolean(anchorEl) && (
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                      sx={{
                        '& .MuiPaper-root': {
                          borderRadius: '16px',
                          mt: 1,
                          minWidth: 240,
                          background: darkMode
                            ? 'rgba(30, 41, 59, 0.95)'
                            : 'rgba(255, 255, 255, 0.95)',
                          backdropFilter: 'blur(20px) saturate(180%)',
                          border: `1px solid ${
                            darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                          }`,
                          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
                        },
                      }}
                    >
                      <Motion.div
                        variants={menuVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {user.name || 'User'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {user.email || 'user@university.edu'}
                          </Typography>
                        </Box>
                        
                        <MenuItem onClick={() => { navigate('/'); handleMenuClose(); }}>
                          <Dashboard sx={{ mr: 2, fontSize: 20 }} />
                          Dashboard
                        </MenuItem>
                        <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
                          <Person sx={{ mr: 2, fontSize: 20 }} />
                          Profile
                        </MenuItem>
                        <MenuItem onClick={() => { navigate('/analytics'); handleMenuClose(); }}>
                          <Analytics sx={{ mr: 2, fontSize: 20 }} />
                          Analytics
                        </MenuItem>
                        <MenuItem onClick={() => { navigate('/calendar'); handleMenuClose(); }}>
                          <CalendarMonth sx={{ mr: 2, fontSize: 20 }} />
                          Calendar
                        </MenuItem>
                        
                        <Divider sx={{ my: 1 }} />
                        
                        <MenuItem onClick={handleMenuClose}>
                          <Settings sx={{ mr: 2, fontSize: 20 }} />
                          Settings
                        </MenuItem>
                        <MenuItem 
                          onClick={handleLogout} 
                          sx={{ 
                            color: theme.palette.error.main,
                            '&:hover': {
                              backgroundColor: theme.palette.error.main + '10',
                            },
                          }}
                        >
                          <ExitToApp sx={{ mr: 2, fontSize: 20 }} />
                          Logout
                        </MenuItem>
                      </Motion.div>
                    </Menu>
                  )}
                </AnimatePresence>
              </>
            )}

            {!isLoggedIn && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/login')}
                    sx={{
                      borderRadius: '12px',
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 3,
                    }}
                  >
                    Login
                  </Button>
                </Motion.div>
                <Motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="contained"
                    onClick={() => navigate('/register')}
                    sx={{
                      borderRadius: '12px',
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 3,
                      background: buttonGradient,
                      boxShadow: '0 4px 15px rgba(30, 64, 175, 0.3)',
                    }}
                  >
                    Sign Up
                  </Button>
                </Motion.div>
              </Box>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Motion.div>
  );
};

export default Header;
