// pages/Calendar.jsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  IconButton,
  Chip,
  useTheme,
  Card,
  CardContent,
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Today,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';

const MotionDiv = motion.div;

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const theme = useTheme();

  // Simple leave data
  const leaves = [
    { date: '2025-08-15', name: 'John Doe', type: 'Vacation' },
    { date: '2025-08-20', name: 'Jane Smith', type: 'Sick' },
    { date: '2025-08-25', name: 'Mike Johnson', type: 'Personal' },
  ];

  const getLeaveForDate = (date) => {
    return leaves.find(leave => leave.date === date.format('YYYY-MM-DD'));
  };

  const generateCalendarDays = () => {
    const startOfMonth = currentDate.startOf('month');
    const daysInMonth = currentDate.daysInMonth();
    const days = [];
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(startOfMonth.add(i - 1, 'day'));
    }
    return days;
  };

  const getLeaveColor = (type) => {
    const colors = {
      'Vacation': theme.palette.info.main,
      'Sick': theme.palette.error.main,
      'Personal': theme.palette.warning.main,
    };
    return colors[type] || theme.palette.primary.main;
  };

  const days = generateCalendarDays();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
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
            Leave Calendar
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => setCurrentDate(currentDate.subtract(1, 'month'))}>
              <ChevronLeft />
            </IconButton>
            
            <Typography variant="h6" sx={{ fontWeight: 600, minWidth: 200, textAlign: 'center' }}>
              {currentDate.format('MMMM YYYY')}
            </Typography>
            
            <IconButton onClick={() => setCurrentDate(currentDate.add(1, 'month'))}>
              <ChevronRight />
            </IconButton>
            
            <IconButton onClick={() => setCurrentDate(dayjs())}>
              <Today />
            </IconButton>
          </Box>
        </Box>

        {/* Simple Calendar Grid */}
        <Paper sx={{ borderRadius: '20px', p: 3 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <Typography key={day} variant="subtitle1" sx={{ textAlign: 'center', fontWeight: 600, p: 2 }}>
                {day}
              </Typography>
            ))}
            
            {days.map((day) => {
              const leave = getLeaveForDate(day);
              const isToday = day.isSame(dayjs(), 'day');
              
              return (
                <Card
                  key={day.format('YYYY-MM-DD')}
                  sx={{
                    minHeight: 100,
                    borderRadius: '12px',
                    border: isToday ? `2px solid ${theme.palette.primary.main}` : '1px solid',
                    borderColor: isToday ? theme.palette.primary.main : theme.palette.divider,
                    background: leave ? `${getLeaveColor(leave.type)}10` : 'transparent',
                  }}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="body1" sx={{ fontWeight: isToday ? 600 : 400, mb: 1 }}>
                      {day.format('D')}
                    </Typography>
                    
                    {leave && (
                      <Chip
                        label={leave.name}
                        size="small"
                        sx={{
                          fontSize: 10,
                          height: 20,
                          background: getLeaveColor(leave.type),
                          color: 'white',
                        }}
                      />
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        </Paper>

        {/* Leave List */}
        <Paper sx={{ borderRadius: '20px', p: 3, mt: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            This Month's Leaves
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {leaves
              .filter(leave => dayjs(leave.date).month() === currentDate.month())
              .map((leave, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, border: '1px solid', borderColor: theme.palette.divider, borderRadius: '8px' }}>
                  <Typography variant="body2" sx={{ minWidth: 100 }}>
                    {dayjs(leave.date).format('MMM DD')}
                  </Typography>
                  <Typography variant="body1" sx={{ flex: 1 }}>
                    {leave.name}
                  </Typography>
                  <Chip
                    label={leave.type}
                    size="small"
                    sx={{
                      background: `${getLeaveColor(leave.type)}20`,
                      color: getLeaveColor(leave.type),
                    }}
                  />
                </Box>
              ))}
          </Box>
        </Paper>
      </MotionDiv>
    </Container>
  );
};

export default Calendar;
