import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
  Chip,
  Button,
  Link,
  Avatar,
  Grid,
  Card,
  CardContent,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  Alert,
} from '@mui/material';
import {
  ArrowBack,
  Person,
  CalendarMonth,
  Schedule,
  Description,
  AttachFile,
  Comment,
  Delete,
  Print,
  Share,
  CheckCircle,
  Cancel,
  Pending,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import applicationService from '../features/applications/applicationService';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import Spinner from '../components/Spinner';

// Make motion usage explicit for ESLint
const MotionDiv = motion.div;

const ApplicationDetail = () => {
  const [application, setApplication] = useState(null);
  const [user] = useState(JSON.parse(localStorage.getItem('user')));
  const [loading, setLoading] = useState(true);
  const [withdrawDialog, setWithdrawDialog] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const data = await applicationService.getApplicationById(id, user.token);
        setApplication(data);
      } catch (error) {
        console.error(error);
        toast.error('Could not fetch application details.');
      } finally {
        setLoading(false);
      }
    };
    fetchApplication();
  }, [id, user.token]);

  const onWithdraw = async () => {
    try {
      await applicationService.deleteApplication(application._id, user.token);
      toast.success('Application withdrawn successfully! 🗑️');
      navigate('/');
    } catch (error) {
      console.error(error);
      toast.error('Could not withdraw application');
    }
    setWithdrawDialog(false);
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

  if (loading) {
    return <Spinner overlay text="Loading application details..." />;
  }

  if (!application) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" color="text.secondary">
          Application not found
        </Typography>
      </Container>
    );
  }

  const isOwner = application.user._id === user._id;
  const isPending = application.status === 'Pending';
  const duration = application.duration || dayjs(application.endDate).diff(dayjs(application.startDate), 'days') + 1;

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, type: 'spring' } },
  };

  return (
    <MotionDiv
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
            sx={{ borderRadius: '12px' }}
          >
            Back
          </Button>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton sx={{ background: theme.palette.background.paper }}>
              <Print />
            </IconButton>
            <IconButton sx={{ background: theme.palette.background.paper }}>
              <Share />
            </IconButton>
          </Box>
        </Box>

        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid item xs={12} md={8}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: '24px',
                p: 4,
                background: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                mb: 3,
              }}
            >
              {/* Application Header */}
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 800,
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {application.subject}
                  </Typography>
                  
                  <Chip
                    icon={getStatusIcon(application.status)}
                    label={application.status}
                    sx={{
                      background: getStatusColor(application.status),
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      px: 2,
                      py: 1,
                      height: 'auto',
                    }}
                  />
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Card
                      sx={{
                        borderRadius: '16px',
                        background: `${theme.palette.primary.main}08`,
                        border: `1px solid ${theme.palette.primary.main}20`,
                      }}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar
                            sx={{
                              width: 48,
                              height: 48,
                              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                              fontWeight: 600,
                            }}
                          >
                            {application.user.name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              {application.user.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {application.user.email}
                            </Typography>
                            <Chip
                              label={application.user.role?.charAt(0).toUpperCase() + application.user.role?.slice(1) || 'Student'}
                              size="small"
                              sx={{ mt: 1, fontSize: '0.7rem' }}
                            />
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Card
                      sx={{
                        borderRadius: '16px',
                        background: `${theme.palette.secondary.main}08`,
                        border: `1px solid ${theme.palette.secondary.main}20`,
                      }}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <CalendarMonth sx={{ color: theme.palette.secondary.main }} />
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Duration
                          </Typography>
                        </Box>
                        <Typography variant="h4" sx={{ fontWeight: 800, color: theme.palette.secondary.main, mb: 1 }}>
                          {duration} day{duration !== 1 ? 's' : ''}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {dayjs(application.startDate).format('MMM DD, YYYY')} to{' '}
                          {dayjs(application.endDate).format('MMM DD, YYYY')}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>

              <Divider sx={{ mb: 3 }} />

              {/* Reason Section */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Description sx={{ color: theme.palette.primary.main }} />
                  Reason for Leave
                </Typography>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: '12px',
                    background: theme.palette.background.default,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                    {application.reason}
                  </Typography>
                </Paper>
              </Box>

              {/* Supporting Document */}
              {application.documentUrl && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AttachFile sx={{ color: theme.palette.primary.main }} />
                    Supporting Document
                  </Typography>
                  <Card
                    sx={{
                      borderRadius: '12px',
                      border: `2px dashed ${theme.palette.primary.main}40`,
                      background: `${theme.palette.primary.main}05`,
                      '&:hover': {
                        border: `2px dashed ${theme.palette.primary.main}60`,
                        background: `${theme.palette.primary.main}08`,
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3, textAlign: 'center' }}>
                      <AttachFile sx={{ fontSize: 48, color: theme.palette.primary.main, mb: 1 }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                        Attached Document
                      </Typography>
                      <Link
                        href={application.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          color: theme.palette.primary.main,
                          textDecoration: 'none',
                          fontWeight: 600,
                          '&:hover': { textDecoration: 'underline' },
                        }}
                      >
                        View Document →
                      </Link>
                    </CardContent>
                  </Card>
                </Box>
              )}

              {/* Staff Comment */}
              {application.staffComment && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Comment sx={{ color: theme.palette.secondary.main }} />
                    Staff Feedback
                  </Typography>
                  <Alert
                    severity="info"
                    sx={{
                      borderRadius: '12px',
                      '& .MuiAlert-message': {
                        fontSize: '1rem',
                        lineHeight: 1.6,
                      },
                    }}
                  >
                    {application.staffComment}
                  </Alert>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: '20px',
                p: 3,
                background: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                position: 'sticky',
                top: 24,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Application Details
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  LEAVE TYPE
                </Typography>
                <Chip
                  label={application.leaveType || 'General'}
                  sx={{
                    mt: 1,
                    background: `${theme.palette.info.main}20`,
                    color: theme.palette.info.main,
                    fontWeight: 600,
                  }}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  SUBMITTED ON
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, fontWeight: 500 }}>
                  {dayjs(application.createdAt).format('MMMM DD, YYYY [at] h:mm A')}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  APPLICATION ID
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, fontFamily: 'monospace', fontSize: '0.8rem' }}>
                  {application._id}
                </Typography>
              </Box>

              {isOwner && isPending && (
                <Button
                  fullWidth
                  variant="contained"
                  color="error"
                  startIcon={<Delete />}
                  onClick={() => setWithdrawDialog(true)}
                  sx={{
                    borderRadius: '12px',
                    py: 1.5,
                    fontWeight: 600,
                    background: `linear-gradient(135deg, ${theme.palette.error.main}, ${theme.palette.error.light})`,
                    '&:hover': {
                      background: `linear-gradient(135deg, ${theme.palette.error.dark}, ${theme.palette.error.main})`,
                    },
                  }}
                >
                  Withdraw Application
                </Button>
              )}
            </Paper>
          </Grid>
        </Grid>

        {/* Withdraw Confirmation Dialog */}
        <Dialog
          open={withdrawDialog}
          onClose={() => setWithdrawDialog(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: { borderRadius: '20px' },
          }}
        >
          <DialogTitle>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Withdraw Application?
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Are you sure you want to withdraw this application? This action cannot be undone.
            </Typography>
            <Alert severity="info" sx={{ borderRadius: '12px' }}>
              Your leave days will be refunded if this application was already approved.
            </Alert>
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 2 }}>
            <Button
              onClick={() => setWithdrawDialog(false)}
              variant="outlined"
              sx={{ borderRadius: '12px', flex: 1 }}
            >
              Cancel
            </Button>
            <Button
              onClick={onWithdraw}
              variant="contained"
              color="error"
              sx={{ borderRadius: '12px', flex: 1 }}
            >
              Withdraw
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </MotionDiv>
  );
};

export default ApplicationDetail;
