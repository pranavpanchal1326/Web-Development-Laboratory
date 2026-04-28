import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Avatar,
  Card,
  CardContent,
  Grid,
  IconButton,
  Tooltip,
  Stack,
  Divider,
  useTheme,
  useMediaQuery,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Collapse,
  Alert,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Pending,
  Person,
  CalendarMonth,
  ExpandMore,
  ExpandLess,
  FilterList,
  Search,
  Download,
  Refresh,
  ViewList,
  ViewModule,
  Comment,
  Schedule,
  Assignment,
  TrendingUp,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import applicationService from '../features/applications/applicationService';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import Spinner from '../components/Spinner';

// Create motion components to make usage explicit
const MotionDiv = motion.div;

const StaffDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentApp, setCurrentApp] = useState(null);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const fetchApplications = async (showRefresh = false) => {
    try {
      if (showRefresh) setRefreshing(true);
      const user = JSON.parse(localStorage.getItem('user'));
      const data = await applicationService.getAllApplications(user.token);
      setApplications(data);
      setFilteredApps(data);
      setIsLoading(false);
      if (showRefresh) {
        setTimeout(() => setRefreshing(false), 1000);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch applications');
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    let filtered = applications;
    
    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(app => app.status.toLowerCase() === filterStatus.toLowerCase());
    }
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(app =>
        app.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.leaveType?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredApps(filtered);
  }, [applications, filterStatus, searchQuery]);

  const handleOpenModal = (e, app) => {
    e.stopPropagation();
    setCurrentApp(app);
    setComment(app.staffComment || '');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentApp(null);
    setComment('');
  };

  const handleStatusUpdate = async (status) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      await applicationService.updateApplicationStatus(
        currentApp._id,
        { status, comment },
        user.token
      );
      
      setApplications(prevState =>
        prevState.map(app =>
          app._id === currentApp._id 
            ? { ...app, status, staffComment: comment } 
            : app
        )
      );
      
      toast.success(`Application ${status.toLowerCase()} successfully!`);
      handleCloseModal();
    } catch (error) {
      console.error(error);
      toast.error('Failed to update status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return theme.palette.success.main;
      case 'Rejected': return theme.palette.error.main;
      default: return theme.palette.warning.main;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved': return <CheckCircle />;
      case 'Rejected': return <Cancel />;
      default: return <Pending />;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'Pending').length,
    approved: applications.filter(a => a.status === 'Approved').length,
    rejected: applications.filter(a => a.status === 'Rejected').length,
  };

  if (isLoading) {
    return <Spinner overlay text="Loading staff dashboard..." />;
  }

  return (
    <MotionDiv
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ minHeight: '100vh' }}
    >
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <MotionDiv variants={itemVariants}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                }}
              >
                Staff Dashboard
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
                Manage and review leave applications
              </Typography>
            </Box>

            <Stack direction="row" spacing={2}>
              <Tooltip title="Refresh Data">
                <IconButton
                  onClick={() => fetchApplications(true)}
                  disabled={refreshing}
                  sx={{
                    background: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <MotionDiv
                    animate={refreshing ? { rotate: 360 } : { rotate: 0 }}
                    transition={{ duration: 1, repeat: refreshing ? Infinity : 0 }}
                  >
                    <Refresh />
                  </MotionDiv>
                </IconButton>
              </Tooltip>

              <FormControlLabel
                control={
                  <Switch
                    checked={viewMode === 'table'}
                    onChange={(e) => setViewMode(e.target.checked ? 'table' : 'cards')}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {viewMode === 'table' ? <ViewList /> : <ViewModule />}
                    {viewMode === 'table' ? 'Table' : 'Cards'}
                  </Box>
                }
              />
            </Stack>
          </Box>
        </MotionDiv>

        {/* Stats Cards */}
        <MotionDiv variants={itemVariants}>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {[
              { label: 'Total Applications', value: stats.total, color: theme.palette.primary.main, icon: Assignment },
              { label: 'Pending Review', value: stats.pending, color: theme.palette.warning.main, icon: Pending },
              { label: 'Approved', value: stats.approved, color: theme.palette.success.main, icon: CheckCircle },
              { label: 'Rejected', value: stats.rejected, color: theme.palette.error.main, icon: Cancel },
            ].map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={stat.label}>
                <MotionDiv
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Card
                    sx={{
                      borderRadius: '20px',
                      background: `${stat.color}08`,
                      border: `1px solid ${stat.color}20`,
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -10,
                        right: -10,
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${stat.color}, ${stat.color}CC)`,
                        opacity: 0.1,
                      }}
                    />
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: '14px',
                            background: `linear-gradient(135deg, ${stat.color}, ${stat.color}CC)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                          }}
                        >
                          <stat.icon />
                        </Box>
                        <Box>
                          <Typography variant="h4" sx={{ fontWeight: 800, color: stat.color }}>
                            {stat.value}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                            {stat.label}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </MotionDiv>
              </Grid>
            ))}
          </Grid>
        </MotionDiv>

        {/* Filters and Search */}
        <MotionDiv variants={itemVariants}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: '20px',
              p: 3,
              mb: 3,
              background: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Search applications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: <Search sx={{ mr: 1, color: theme.palette.text.secondary }} />,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack direction="row" spacing={2} flexWrap="wrap">
                  {['all', 'pending', 'approved', 'rejected'].map((status) => (
                    <Chip
                      key={status}
                      label={status.charAt(0).toUpperCase() + status.slice(1)}
                      onClick={() => setFilterStatus(status)}
                      variant={filterStatus === status ? 'filled' : 'outlined'}
                      sx={{
                        borderRadius: '8px',
                        fontWeight: 600,
                        ...(filterStatus === status && {
                          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                          color: 'white',
                        }),
                      }}
                    />
                  ))}
                </Stack>
              </Grid>
            </Grid>
          </Paper>
        </MotionDiv>

        {/* Applications Display */}
        <MotionDiv variants={itemVariants}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: '24px',
              overflow: 'hidden',
              background: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            {filteredApps.length === 0 ? (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 8,
                  px: 3,
                }}
              >
                <MotionDiv
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Assignment sx={{ fontSize: 64, color: theme.palette.primary.main, mb: 2, opacity: 0.7 }} />
                </MotionDiv>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                  No Applications Found
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {applications.length === 0 
                    ? "No applications have been submitted yet." 
                    : "No applications match your current filters."}
                </Typography>
              </Box>
            ) : viewMode === 'cards' || isMobile ? (
              // Cards View (Mobile-First)
              <Box sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  {filteredApps.map((app, index) => (
                    <Grid item xs={12} sm={6} lg={4} key={app._id}>
                      <MotionDiv
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
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
                          <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar
                                  sx={{
                                    width: 48,
                                    height: 48,
                                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                    fontWeight: 600,
                                  }}
                                >
                                  {app.user.name.charAt(0)}
                                </Avatar>
                                <Box>
                                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    {app.user.name}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {app.user.email}
                                  </Typography>
                                </Box>
                              </Box>
                              <Chip
                                icon={getStatusIcon(app.status)}
                                label={app.status}
                                size="small"
                                sx={{
                                  background: getStatusColor(app.status),
                                  color: 'white',
                                  fontWeight: 600,
                                }}
                              />
                            </Box>

                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                              {app.subject}
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <CalendarMonth sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                              <Typography variant="body2" color="text.secondary">
                                {dayjs(app.startDate).format('MMM DD')} - {dayjs(app.endDate).format('MMM DD, YYYY')}
                              </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                              <Schedule sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                              <Typography variant="body2" color="text.secondary">
                                {app.leaveType} • {dayjs(app.endDate).diff(dayjs(app.startDate), 'days') + 1} days
                              </Typography>
                            </Box>

                            {app.status === 'Pending' && (
                              <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                                <Button
                                  size="small"
                                  variant="contained"
                                  color="success"
                                  onClick={(e) => handleOpenModal(e, app)}
                                  sx={{ borderRadius: '8px', flex: 1 }}
                                >
                                  Approve
                                </Button>
                                <Button
                                  size="small"
                                  variant="contained"
                                  color="error"
                                  onClick={(e) => handleOpenModal(e, app)}
                                  sx={{ borderRadius: '8px', flex: 1 }}
                                >
                                  Reject
                                </Button>
                              </Stack>
                            )}

                            {app.staffComment && (
                              <Alert
                                severity="info"
                                sx={{ mt: 2, borderRadius: '8px' }}
                                icon={<Comment />}
                              >
                                <Typography variant="caption">
                                  {app.staffComment}
                                </Typography>
                              </Alert>
                            )}
                          </CardContent>
                        </Card>
                      </MotionDiv>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ) : (
              // Table View (Desktop)
              <TableContainer>
                <Table>
                  <TableHead
                    sx={{
                      background: theme.palette.mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.02)' 
                        : 'rgba(0, 0, 0, 0.02)',
                    }}
                  >
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.9rem' }}>Student</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.9rem' }}>Subject</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.9rem' }}>Dates</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.9rem' }}>Type</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.9rem' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.9rem' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredApps.map((app) => (
                      <TableRow
                        key={app._id}
                        onClick={() => navigate(`/application/${app._id}`)}
                        sx={{
                          cursor: 'pointer',
                          '&:hover': {
                            background: theme.palette.action.hover,
                          },
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar
                              sx={{
                                width: 32,
                                height: 32,
                                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                fontSize: '0.85rem',
                                fontWeight: 600,
                              }}
                            >
                              {app.user.name.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {app.user.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {app.user.email}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {app.subject}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {dayjs(app.startDate).format('MMM DD')} - {dayjs(app.endDate).format('MMM DD')}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {dayjs(app.endDate).diff(dayjs(app.startDate), 'days') + 1} days
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={app.leaveType}
                            size="small"
                            sx={{
                              borderRadius: '6px',
                              fontWeight: 500,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getStatusIcon(app.status)}
                            label={app.status}
                            size="small"
                            sx={{
                              background: getStatusColor(app.status),
                              color: 'white',
                              fontWeight: 600,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          {app.status === 'Pending' && (
                            <Stack direction="row" spacing={1}>
                              <Button
                                size="small"
                                variant="contained"
                                color="success"
                                onClick={(e) => handleOpenModal(e, app)}
                                sx={{ borderRadius: '6px' }}
                              >
                                Approve
                              </Button>
                              <Button
                                size="small"
                                variant="contained"
                                color="error"
                                onClick={(e) => handleOpenModal(e, app)}
                                sx={{ borderRadius: '6px' }}
                              >
                                Reject
                              </Button>
                            </Stack>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </MotionDiv>

        {/* Status Update Modal */}
        <Dialog
          open={isModalOpen}
          onClose={handleCloseModal}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '20px',
              background: theme.palette.background.paper,
            },
          }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Update Application Status
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {currentApp?.user.name} - {currentApp?.subject}
            </Typography>
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Add a comment (optional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Provide feedback or reason for your decision..."
              sx={{
                mt: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                },
              }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 2 }}>
            <Button
              onClick={handleCloseModal}
              variant="outlined"
              sx={{ borderRadius: '10px', flex: 1 }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleStatusUpdate('Rejected')}
              variant="contained"
              color="error"
              sx={{ borderRadius: '10px', flex: 1 }}
            >
              Reject
            </Button>
            <Button
              onClick={() => handleStatusUpdate('Approved')}
              variant="contained"
              color="success"
              sx={{ borderRadius: '10px', flex: 1 }}
            >
              Approve
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </MotionDiv>
  );
};

export default StaffDashboard;
