import React, { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  useTheme,
  Avatar,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp,
  People,
  Assignment,
  CheckCircle,
  Cancel,
  Pending,
} from '@mui/icons-material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement } from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import applicationService from '../features/applications/applicationService';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement);

// Create motion component to make usage explicit
const MotionDiv = motion.div;

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const data = await applicationService.getApplicationStats(user.token);
        setStats(data);
      } catch (error) {
        console.error(error);
        toast.error('Could not fetch analytics data');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <Spinner overlay text="Loading analytics..." />;
  }

  const pieChartData = {
    labels: ['Pending', 'Approved', 'Rejected'],
    datasets: [
      {
        label: 'Applications',
        data: [stats?.pending || 0, stats?.approved || 0, stats?.rejected || 0],
        backgroundColor: [
          theme.palette.warning.main,
          theme.palette.success.main,
          theme.palette.error.main,
        ],
        borderColor: [
          theme.palette.warning.dark,
          theme.palette.success.dark,
          theme.palette.error.dark,
        ],
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  const barChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Applications Submitted',
        data: [12, 19, 8, 15, 22, 18],
        backgroundColor: `${theme.palette.primary.main}80`,
        borderColor: theme.palette.primary.main,
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
            weight: '600',
          },
        },
      },
      tooltip: {
        backgroundColor: theme.palette.background.paper,
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.primary,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        cornerRadius: 12,
        padding: 12,
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100 },
    },
  };

  const statsData = [
    {
      title: 'Total Applications',
      value: stats?.totalApplications || 0,
      icon: Assignment,
      color: theme.palette.primary.main,
      gradient: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
    },
    {
      title: 'Pending Review',
      value: stats?.pending || 0,
      icon: Pending,
      color: theme.palette.warning.main,
      gradient: `linear-gradient(135deg, ${theme.palette.warning.main}, ${theme.palette.warning.light})`,
    },
    {
      title: 'Approved',
      value: stats?.approved || 0,
      icon: CheckCircle,
      color: theme.palette.success.main,
      gradient: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.light})`,
    },
    {
      title: 'Rejected',
      value: stats?.rejected || 0,
      icon: Cancel,
      color: theme.palette.error.main,
      gradient: `linear-gradient(135deg, ${theme.palette.error.main}, ${theme.palette.error.light})`,
    },
  ];

  const approvalRate = stats?.totalApplications ? ((stats.approved / stats.totalApplications) * 100).toFixed(1) : 0;

  return (
    <MotionDiv
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <MotionDiv variants={itemVariants}>
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                mb: 1,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Admin Analytics 📊
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
              Comprehensive overview of leave applications and system metrics
            </Typography>
          </Box>
        </MotionDiv>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {statsData.map((stat) => (
            <Grid item xs={12} sm={6} lg={3} key={stat.title}>
              <MotionDiv
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                style={{ height: '100%' }}
              >
                <Card
                  sx={{
                    borderRadius: '20px',
                    background: `${stat.color}08`,
                    border: `1px solid ${stat.color}20`,
                    position: 'relative',
                    overflow: 'hidden',
                    height: '100%',
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
                      background: stat.gradient,
                      opacity: 0.1,
                    }}
                  />
                  
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar
                        sx={{
                          width: 56,
                          height: 56,
                          background: stat.gradient,
                          boxShadow: `0 8px 24px ${stat.color}40`,
                        }}
                      >
                        <stat.icon sx={{ fontSize: 28 }} />
                      </Avatar>
                      <Box>
                        <Typography variant="h3" sx={{ fontWeight: 800, color: stat.color }}>
                          {stat.value}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                          {stat.title}
                        </Typography>
                      </Box>
                    </Box>
                    
                    {stat.title === 'Total Applications' && (
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            Approval Rate
                          </Typography>
                          <Typography variant="caption" sx={{ color: stat.color, fontWeight: 600 }}>
                            {approvalRate}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={parseFloat(approvalRate)}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: `${stat.color}20`,
                            '& .MuiLinearProgress-bar': {
                              background: stat.gradient,
                              borderRadius: 3,
                            },
                          }}
                        />
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </MotionDiv>
            </Grid>
          ))}
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={4}>
          {/* Status Distribution */}
          <Grid item xs={12} lg={6}>
            <MotionDiv variants={itemVariants}>
              <Paper
                elevation={0}
                sx={{
                  borderRadius: '20px',
                  p: 3,
                  background: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  height: '400px',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingUp sx={{ color: theme.palette.primary.main }} />
                  Application Status Distribution
                </Typography>
                <Box sx={{ height: '300px', position: 'relative' }}>
                  <Pie data={pieChartData} options={chartOptions} />
                </Box>
              </Paper>
            </MotionDiv>
          </Grid>

          {/* Monthly Trends */}
          <Grid item xs={12} lg={6}>
            <MotionDiv variants={itemVariants}>
              <Paper
                elevation={0}
                sx={{
                  borderRadius: '20px',
                  p: 3,
                  background: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  height: '400px',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <People sx={{ color: theme.palette.secondary.main }} />
                  Monthly Application Trends
                </Typography>
                <Box sx={{ height: '300px', position: 'relative' }}>
                  <Bar data={barChartData} options={chartOptions} />
                </Box>
              </Paper>
            </MotionDiv>
          </Grid>

          {/* Key Insights */}
          <Grid item xs={12}>
            <MotionDiv variants={itemVariants}>
              <Paper
                elevation={0}
                sx={{
                  borderRadius: '20px',
                  p: 4,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`,
                  border: `1px solid ${theme.palette.primary.main}20`,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                  📈 Key Insights & Metrics
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ fontWeight: 800, color: theme.palette.primary.main }}>
                        {approvalRate}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Overall Approval Rate
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ fontWeight: 800, color: theme.palette.secondary.main }}>
                        2.5
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Avg. Processing Days
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ fontWeight: 800, color: theme.palette.success.main }}>
                        89%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Staff Satisfaction
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ fontWeight: 800, color: theme.palette.warning.main }}>
                        +12%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Growth This Month
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </MotionDiv>
          </Grid>
        </Grid>
      </Container>
    </MotionDiv>
  );
};

export default AdminDashboard;
