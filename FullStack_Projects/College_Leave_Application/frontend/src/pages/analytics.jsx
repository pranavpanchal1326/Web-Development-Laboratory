import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Grid,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,
} from '@mui/material';
import {
  TrendingUp,
  People,
  CalendarMonth,
  Assignment,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const MotionDiv = motion.div;

const Analytics = () => {
  const [timeframe, setTimeframe] = useState('yearly');
  const [analytics, setAnalytics] = useState({
    totalApplications: 0,
    approvedApplications: 0,
    pendingApplications: 0,
    rejectedApplications: 0,
    averageLeaveDays: 0,
    topLeaveType: '',
    monthlyTrends: [],
    leaveTypeDistribution: [],
  });

  const theme = useTheme();

  // Use useEffect and setAnalytics to fetch (simulate) data
  useEffect(() => {
    // Simulate async fetch
    setTimeout(() => {
      setAnalytics({
        totalApplications: 156,
        approvedApplications: 142,
        pendingApplications: 8,
        rejectedApplications: 6,
        averageLeaveDays: 12.5,
        topLeaveType: 'Vacation Leave',
        monthlyTrends: [
          { month: 'Jan', applications: 12 },
          { month: 'Feb', applications: 8 },
          { month: 'Mar', applications: 15 },
          { month: 'Apr', applications: 22 },
          { month: 'May', applications: 18 },
          { month: 'Jun', applications: 25 },
        ],
        leaveTypeDistribution: [
          { type: 'Vacation', count: 45, color: '#3f51b5' },
          { type: 'Sick', count: 32, color: '#f44336' },
          { type: 'Personal', count: 28, color: '#ff9800' },
          { type: 'Emergency', count: 15, color: '#e91e63' },
        ],
      });
    }, 800);
  }, [timeframe]); // refetch if timeframe changes

  const StatCard = ({ icon, title, value, subtitle, color }) => (
    <Card sx={{ borderRadius: '16px', height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: '12px',
              background: `${color}20`,
              mr: 2,
            }}
          >
            {React.cloneElement(icon, { sx: { color, fontSize: 24 } })}
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
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
              Analytics Dashboard
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
              Leave application insights and trends
            </Typography>
          </Box>
          
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Timeframe</InputLabel>
            <Select
              value={timeframe}
              label="Timeframe"
              onChange={(e) => setTimeframe(e.target.value)}
              sx={{ borderRadius: '12px' }}
            >
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="quarterly">Quarterly</MenuItem>
              <MenuItem value="yearly">Yearly</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<Assignment />}
              title="Total Applications"
              value={analytics.totalApplications}
              subtitle="This year"
              color={theme.palette.primary.main}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<TrendingUp />}
              title="Approved"
              value={analytics.approvedApplications}
              subtitle={
                analytics.totalApplications > 0
                  ? `${((analytics.approvedApplications / analytics.totalApplications) * 100).toFixed(1)}% approval rate`
                  : "N/A"
              }
              color={theme.palette.success.main}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<People />}
              title="Pending"
              value={analytics.pendingApplications}
              subtitle="Awaiting approval"
              color={theme.palette.warning.main}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<CalendarMonth />}
              title="Avg. Leave Days"
              value={analytics.averageLeaveDays}
              subtitle="Per employee"
              color={theme.palette.info.main}
            />
          </Grid>
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ borderRadius: '20px', p: 3, height: 400 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Monthly Application Trends
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'end',
                  justifyContent: 'space-around',
                  height: 300,
                  gap: 2,
                }}
              >
                {/* Use index here */}
                {analytics.monthlyTrends.map((item, index) => (
                  <Box key={index} sx={{ textAlign: 'center', flex: 1 }}>
                    <Box
                      sx={{
                        height: `${(item.applications / 25) * 250}px`,
                        background: `linear-gradient(to top, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                        borderRadius: '8px 8px 0 0',
                        mb: 1,
                        minHeight: '20px',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.05)',
                        },
                      }}
                    />
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                      {item.month}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.applications}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ borderRadius: '20px', p: 3, height: 400 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Leave Type Distribution
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* Use index here */}
                {analytics.leaveTypeDistribution.map((item, index) => (
                  <Box key={index}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {item.type}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.count}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        background: theme.palette.grey[200],
                        overflow: 'hidden',
                      }}
                    >
                      <Box
                        sx={{
                          height: '100%',
                          width: `${(item.count / 45) * 100}%`,
                          background: item.color,
                          transition: 'width 0.5s ease',
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </MotionDiv>
    </Container>
  );
};

export default Analytics;
