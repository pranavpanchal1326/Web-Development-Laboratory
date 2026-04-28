import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Box,
  Button,
  Typography,
  Container,
  Card,
  CardContent,
  Grid,
  Chip,
  Paper,
  LinearProgress,
  IconButton,
  Tooltip,
  Stack,
  useTheme,
} from '@mui/material';
import {
  Add,
  EventNote,
  TrendingUp,
  CalendarMonth,
  AccessTime,
  CheckCircle,
  Cancel,
  Pending,
  Sick,
  BeachAccess,
  Person,
  Analytics,
  Refresh,
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import applicationService from '../features/applications/applicationService';
import dayjs from 'dayjs';
import Calendar from '../components/Calendar';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';
import io from 'socket.io-client';

// Connect to backend for real-time updates
const socket = io('http://localhost:5000');

const StudentDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [user] = useState(JSON.parse(localStorage.getItem('user')));
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();

  // Memoize fetchApplications to fix useEffect dependency warning
  const fetchApplications = useCallback(async (showRefresh = false) => {
    try {
      if (showRefresh) setRefreshing(true);
      if (user) {
        const data = await applicationService.getApplications(user.token);
        setApplications(data);
      }
      setIsLoading(false);
      if (showRefresh) {
        setTimeout(() => setRefreshing(false), 1000);
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    fetchApplications();

    // === 1. SOCKET.IO REAL-TIME UPDATES ===
    // Listen for new applications from other users or status updates
    socket.on('applicationStatusUpdated', (updatedApp) => {
      setApplications(prev => 
        prev.map(app => 
          app._id === updatedApp._id ? updatedApp : app
        )
      );
      toast.info(`Application "${updatedApp.subject}" status updated to ${updatedApp.status}`);
    });

    socket.on('newApplicationCreated', (newApp) => {
      // Only add if it's the current user's application
      if (newApp.userId === user?.id) {
        setApplications(prev => [newApp, ...prev]);
        toast.success('Your application has been submitted successfully!');
      }
    });

    // Cleanup socket listeners
    return () => {
      socket.off('applicationStatusUpdated');
      socket.off('newApplicationCreated');
    };
  }, [fetchApplications, user?.id]);

  // === 3. USEMEMO PERFORMANCE OPTIMIZATION ===
  // Memoize expensive calculations
  const leaveBalance = useMemo(() => 
    user?.leaveQuotas || { sickLeave: 10, casualLeave: 15 }, 
    [user?.leaveQuotas]
  );

  const usedLeave = useMemo(() => ({
    sick: applications.filter(app => 
      app.status === 'Approved' && app.leaveType?.toLowerCase() === 'sick'
    ).length,
    casual: applications.filter(app => 
      app.status === 'Approved' && app.leaveType?.toLowerCase() === 'casual'
    ).length,
  }), [applications]);

  const quickStats = useMemo(() => [
    { 
      label: 'Total Applications', 
      value: applications.length, 
      color: theme.palette.primary.main 
    },
    { 
      label: 'Pending', 
      value: applications.filter(a => a.status === 'Pending').length, 
      color: theme.palette.warning.main 
    },
    { 
      label: 'Approved', 
      value: applications.filter(a => a.status === 'Approved').length, 
      color: theme.palette.success.main 
    },
    { 
      label: 'This Month', 
      value: applications.filter(a => dayjs(a.startDate).month() === dayjs().month()).length, 
      color: theme.palette.secondary.main 
    },
  ], [applications, theme.palette]);

  const leaveCards = useMemo(() => [
    {
      title: 'Sick Leave',
      available: leaveBalance.sickLeave - usedLeave.sick,
      total: leaveBalance.sickLeave,
      used: usedLeave.sick,
      color: theme.palette.error.main,
      icon: <Sick />,
      gradient: `linear-gradient(135deg, ${theme.palette.error.main}, ${theme.palette.error.light})`,
    },
    {
      title: 'Casual Leave',
      available: leaveBalance.casualLeave - usedLeave.casual,
      total: leaveBalance.casualLeave,
      used: usedLeave.casual,
      color: theme.palette.success.main,
      icon: <BeachAccess />,
      gradient: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.light})`,
    },
  ], [leaveBalance, usedLeave, theme.palette]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved': return <CheckCircle sx={{ fontSize: 20 }} />;
      case 'Rejected': return <Cancel sx={{ fontSize: 20 }} />;
      default: return <Pending sx={{ fontSize: 20 }} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return theme.palette.success.main;
      case 'Rejected': return theme.palette.error.main;
      default: return theme.palette.warning.main;
    }
  };

  const getLeaveTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'sick': return <Sick />;
      case 'vacation': case 'casual': return <BeachAccess />;
      default: return <Person />;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const cardHoverVariants = {
    hover: {
      scale: 1.02,
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
      transition: { duration: 0.3 },
    },
  };

  // Pre-compute gradient strings to avoid template literal issues
  const headerGradient = `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`;
  const buttonGradient = `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`;
  const buttonHoverGradient = `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`;
  const chipGradient = `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`;
  const emptyStateGradient = `linear-gradient(135deg, ${theme.palette.primary.main}08, ${theme.palette.secondary.main}08)`;
  const statsGradient = `linear-gradient(135deg, ${theme.palette.secondary.main}15, ${theme.palette.secondary.main}08)`;

  if (isLoading) {
    return <Spinner overlay text="Loading your dashboard..." />;
  }

  return (
    <Motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ minHeight: '100vh', background: 'transparent' }}
    >
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header Section */}
        <Motion.div variants={itemVariants}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 4,
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Box>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  background: headerGradient,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                }}
              >
                Welcome back, {user?.name?.split(' ')[0]}! 👋
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
                Manage your leave applications with ease
              </Typography>
            </Box>

            <Stack direction="row" spacing={2}>
              <Motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Tooltip title="Refresh Data">
                  <IconButton
                    onClick={() => fetchApplications(true)}
                    disabled={refreshing}
                    sx={{
                      background: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`,
                      '&:hover': {
                        background: theme.palette.primary.main + '10',
                      },
                    }}
                  >
                    <Motion.div
                      animate={refreshing ? { rotate: 360 } : { rotate: 0 }}
                      transition={{ duration: 1, repeat: refreshing ? Infinity : 0 }}
                    >
                      <Refresh />
                    </Motion.div>
                  </IconButton>
                </Tooltip>
              </Motion.div>

              <Motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  component={RouterLink}
                  to="/new-application"
                  variant="contained"
                  size="large"
                  startIcon={<Add />}
                  sx={{
                    borderRadius: '16px',
                    px: 4,
                    py: 1.5,
                    background: buttonGradient,
                    boxShadow: '0 8px 32px rgba(30, 64, 175, 0.3)',
                    fontWeight: 600,
                    '&:hover': {
                      background: buttonHoverGradient,
                      boxShadow: '0 12px 40px rgba(30, 64, 175, 0.4)',
                    },
                  }}
                >
                  New Leave Request
                </Button>
              </Motion.div>
            </Stack>
          </Box>
        </Motion.div>

        <Grid container spacing={3}>
          {/* Leave Balance Cards */}
          <Grid item xs={12} lg={8}>
            <Motion.div variants={itemVariants}>
              <Paper
                elevation={0}
                sx={{
                  borderRadius: '24px',
                  p: 3,
                  mb: 3,
                  background: theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${theme.palette.divider}`,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingUp sx={{ color: theme.palette.primary.main }} />
                  Leave Balance
                </Typography>

                <Grid container spacing={3}>
                  {leaveCards.map((leave, index) => (
                    <Grid item xs={12} sm={6} key={leave.title}>
                      <Motion.div
                        variants={cardHoverVariants}
                        whileHover="hover"
                        initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                      >
                        <Card
                          sx={{
                            borderRadius: '20px',
                            background: `${leave.color}08`,
                            border: `1px solid ${leave.color}20`,
                            position: 'relative',
                            overflow: 'hidden',
                          }}
                        >
                          <Box
                            sx={{
                              position: 'absolute',
                              top: -20,
                              right: -20,
                              width: 80,
                              height: 80,
                              borderRadius: '50%',
                              background: leave.gradient,
                              opacity: 0.1,
                            }}
                          />
                          
                          <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                              <Box
                                sx={{
                                  width: 48,
                                  height: 48,
                                  borderRadius: '14px',
                                  background: leave.gradient,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: 'white',
                                }}
                              >
                                {leave.icon}
                              </Box>
                              <Box>
                                <Typography variant="h4" sx={{ fontWeight: 800, color: leave.color }}>
                                  {leave.available}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  days available
                                </Typography>
                              </Box>
                            </Box>

                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                              {leave.title}
                            </Typography>

                            <Box sx={{ mb: 2 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="caption" color="text.secondary">
                                  Used: {leave.used} / {leave.total}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {Math.round((leave.used / leave.total) * 100)}%
                                </Typography>
                              </Box>
                              <LinearProgress
                                variant="determinate"
                                value={(leave.used / leave.total) * 100}
                                sx={{
                                  height: 8,
                                  borderRadius: 4,
                                  backgroundColor: `${leave.color}15`,
                                  '& .MuiLinearProgress-bar': {
                                    background: leave.gradient,
                                    borderRadius: 4,
                                  },
                                }}
                              />
                            </Box>

                            <Typography variant="body2" color="text.secondary">
                              Reset on January 1st
                            </Typography>
                          </CardContent>
                        </Card>
                      </Motion.div>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Motion.div>

            {/* Applications List */}
            <Motion.div variants={itemVariants}>
              <Paper
                elevation={0}
                sx={{
                  borderRadius: '24px',
                  p: 3,
                  background: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EventNote sx={{ color: theme.palette.primary.main }} />
                    Your Applications
                  </Typography>
                  <Chip
                    label={`${applications.length} Total`}
                    sx={{
                      background: chipGradient,
                      color: 'white',
                      fontWeight: 600,
                    }}
                  />
                </Box>

                <AnimatePresence>
                  {applications.length > 0 ? (
                    <Grid container spacing={2}>
                      {applications.map((app, index) => (
                        <Grid item xs={12} sm={6} lg={4} key={app._id}>
                          <Motion.div
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.03 }}
                            style={{ cursor: 'pointer' }}
                            onClick={() => navigate(`/application/${app._id}`)}
                          >
                            <Card
                              sx={{
                                borderRadius: '16px',
                                border: `2px solid ${getStatusColor(app.status)}20`,
                                background: `${getStatusColor(app.status)}05`,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  border: `2px solid ${getStatusColor(app.status)}40`,
                                  boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15)',
                                },
                              }}
                            >
                              <CardContent sx={{ p: 2.5 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box
                                      sx={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: '8px',
                                        background: `linear-gradient(135deg, ${getStatusColor(app.status)}, ${getStatusColor(app.status)}CC)`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                      }}
                                    >
                                      {getLeaveTypeIcon(app.leaveType)}
                                    </Box>
                                    <Chip
                                      icon={getStatusIcon(app.status)}
                                      label={app.status}
                                      size="small"
                                      sx={{
                                        background: getStatusColor(app.status),
                                        color: 'white',
                                        fontWeight: 600,
                                        fontSize: '0.7rem',
                                      }}
                                    />
                                  </Box>
                                </Box>

                                <Typography
                                  variant="h6"
                                  sx={{
                                    fontWeight: 600,
                                    mb: 1,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  {app.subject}
                                </Typography>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                  <CalendarMonth sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                    {dayjs(app.startDate).format('MMM DD')} - {dayjs(app.endDate).format('MMM DD, YYYY')}
                                  </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                  <AccessTime sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                                  <Typography variant="body2" color="text.secondary">
                                    {app.duration || dayjs(app.endDate).diff(dayjs(app.startDate), 'days') + 1} days
                                  </Typography>
                                </Box>

                                {app.staffComment && (
                                  <Box
                                    sx={{
                                      p: 1.5,
                                      borderRadius: '8px',
                                      background: theme.palette.background.default,
                                      border: `1px solid ${theme.palette.divider}`,
                                    }}
                                  >
                                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                                      Staff Note:
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        mt: 0.5,
                                        overflow: 'hidden',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                      }}
                                    >
                                      {app.staffComment}
                                    </Typography>
                                  </Box>
                                )}
                              </CardContent>
                            </Card>
                          </Motion.div>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Motion.div
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <Box
                        sx={{
                          textAlign: 'center',
                          py: 8,
                          px: 3,
                          borderRadius: '16px',
                          background: emptyStateGradient,
                          border: `1px dashed ${theme.palette.primary.main}30`,
                        }}
                      >
                        <Motion.div
                          animate={{
                            y: [0, -10, 0],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          <EventNote
                            sx={{
                              fontSize: 64,
                              color: theme.palette.primary.main,
                              mb: 2,
                              opacity: 0.7,
                            }}
                          />
                        </Motion.div>
                        
                        <Typography
                          variant="h5"
                          sx={{ fontWeight: 700, mb: 1, color: theme.palette.text.primary }}
                        >
                          No Applications Yet
                        </Typography>
                        
                        <Typography
                          variant="body1"
                          color="text.secondary"
                          sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}
                        >
                          Ready to submit your first leave request? Click below to get started with our simple application process.
                        </Typography>

                        <Motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            component={RouterLink}
                            to="/new-application"
                            variant="contained"
                            size="large"
                            startIcon={<Add />}
                            sx={{
                              borderRadius: '12px',
                              px: 4,
                              py: 1.5,
                              background: buttonGradient,
                              boxShadow: '0 8px 32px rgba(30, 64, 175, 0.3)',
                              fontWeight: 600,
                            }}
                          >
                            Apply for Leave
                          </Button>
                        </Motion.div>
                      </Box>
                    </Motion.div>
                  )}
                </AnimatePresence>
              </Paper>
            </Motion.div>
          </Grid>

          {/* Quick Stats Sidebar */}
          <Grid item xs={12} lg={4}>
            <Motion.div variants={itemVariants}>
              <Stack spacing={2}>
                {/* Quick Stats */}
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: '20px',
                    p: 3,
                    background: statsGradient,
                    border: `1px solid ${theme.palette.secondary.main}20`,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Analytics sx={{ color: theme.palette.secondary.main }} />
                    Quick Stats
                  </Typography>

                  <Stack spacing={2}>
                    {quickStats.map((stat) => (
                      <Box
                        key={stat.label}
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          p: 2,
                          borderRadius: '12px',
                          background: theme.palette.background.paper,
                          border: `1px solid ${stat.color}20`,
                        }}
                      >
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                          {stat.label}
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 700, color: stat.color }}
                        >
                          {stat.value}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Paper>

                {/* Calendar Widget */}
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: '20px',
                    p: 3,
                    background: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarMonth sx={{ color: theme.palette.primary.main }} />
                    Calendar View
                  </Typography>
                  
                  <Box sx={{ height: 300, overflow: 'hidden', borderRadius: '12px' }}>
                    <Calendar applications={applications.filter(a => a.status === 'Approved')} />
                  </Box>
                </Paper>
              </Stack>
            </Motion.div>
          </Grid>
        </Grid>
      </Container>
    </Motion.div>
  );
};

export default StudentDashboard;
