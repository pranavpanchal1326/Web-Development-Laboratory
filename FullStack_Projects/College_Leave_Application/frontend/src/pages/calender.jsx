// pages/Calendar.jsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  useTheme,
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
  const [selectedDate, setSelectedDate] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const theme = useTheme();

  // Mock leave data
  const leaveData = {
    '2025-08-15': [
      { name: 'John Doe', type: 'Vacation', status: 'approved' },
      { name: 'Jane Smith', type: 'Sick', status: 'pending' },
    ],
    '2025-08-20': [
      { name: 'Mike Johnson', type: 'Personal', status: 'approved' },
    ],
    '2025-08-25': [
      { name: 'Sarah Wilson', type: 'Emergency', status: 'approved' },
      { name: 'Tom Brown', type: 'Vacation', status: 'pending' },
      { name: 'Lisa Davis', type: 'Sick', status: 'approved' },
    ],
  };

  const getLeaveTypeColor = (type) => {
    const colors = {
      'Vacation': theme.palette.info.main,
      'Sick': theme.palette.error.main,
      'Personal': theme.palette.warning.main,
      'Emergency': theme.palette.secondary.main,
    };
    return colors[type] || theme.palette.primary.main;
  };

  const generateCalendarDays = () => {
    const startOfMonth = currentDate.startOf('month');
    const endOfMonth = currentDate.endOf('month');
    const startDate = startOfMonth.startOf('week');
    const endDate = endOfMonth.endOf('week');
    
    const days = [];
    let current = startDate;
    
    while (current.isBefore(endDate) || current.isSame(endDate, 'day')) {
      days.push(current);
      current = current.add(1, 'day');
    }
    
    return days;
  };

  const handleDateClick = (date) => {
    const dateKey = date.format('YYYY-MM-DD');
    if (leaveData[dateKey]) {
      setSelectedDate({ date, leaves: leaveData[dateKey] });
      setDialogOpen(true);
    }
  };

  const days = generateCalendarDays();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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
            <IconButton
              onClick={() => setCurrentDate(currentDate.subtract(1, 'month'))}
              sx={{ border: `1px solid ${theme.palette.divider}` }}
            >
              <ChevronLeft />
            </IconButton>
            
            <Typography variant="h6" sx={{ fontWeight: 600, minWidth: 200, textAlign: 'center' }}>
              {currentDate.format('MMMM YYYY')}
            </Typography>
            
            <IconButton
              onClick={() => setCurrentDate(currentDate.add(1, 'month'))}
              sx={{ border: `1px solid ${theme.palette.divider}` }}
            >
              <ChevronRight />
            </IconButton>
            
            <IconButton
              onClick={() => setCurrentDate(dayjs())}
              sx={{ border: `1px solid ${theme.palette.divider}`, ml: 2 }}
            >
              <Today />
            </IconButton>
          </Box>
        </Box>

        {/* Calendar */}
        <Paper sx={{ borderRadius: '20px', p: 3 }}>
          {/* Week Days Header */}
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, mb: 2 }}>
            {weekDays.map((day) => (
              <Box key={day} sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                  {day}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Calendar Grid */}
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
            {days.map((day) => {
              const dateKey = day.format('YYYY-MM-DD');
              const leaves = leaveData[dateKey] || [];
              const isCurrentMonth = day.month() === currentDate.month();
              const isToday = day.isSame(dayjs(), 'day');

              return (
                <Box
                  key={day.format('YYYY-MM-DD')}
                  onClick={() => handleDateClick(day)}
                  sx={{
                    minHeight: 120,
                    p: 1,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: '8px',
                    cursor: leaves.length > 0 ? 'pointer' : 'default',
                    background: isToday 
                      ? `${theme.palette.primary.main}10` 
                      : 'transparent',
                    opacity: isCurrentMonth ? 1 : 0.5,
                    '&:hover': leaves.length > 0 ? {
                      background: `${theme.palette.action.hover}`,
                    } : {},
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: isToday ? 600 : 400,
                      color: isToday ? theme.palette.primary.main : 'text.primary',
                      mb: 1,
                    }}
                  >
                    {day.format('D')}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {leaves.slice(0, 2).map((leave, index) => (
                      <Chip
                        key={index}
                        label={leave.name.split(' ')[0]}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: 10,
                          background: `${getLeaveTypeColor(leave.type)}20`,
                          color: getLeaveTypeColor(leave.type),
                          '& .MuiChip-label': { px: 1 },
                        }}
                      />
                    ))}
                    {leaves.length > 2 && (
                      <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
                        +{leaves.length - 2} more
                      </Typography>
                    )}
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Paper>

        {/* Leave Details Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Leaves on {selectedDate?.date.format('MMMM D, YYYY')}
          </DialogTitle>
          <DialogContent>
            <List>
              {selectedDate?.leaves.map((leave, index) => (
                <ListItem key={index} sx={{ px: 0 }}>
                  <ListItemText
                    primary={leave.name}
                    secondary={
                      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                        <Chip
                          label={leave.type}
                          size="small"
                          sx={{
                            background: `${getLeaveTypeColor(leave.type)}20`,
                            color: getLeaveTypeColor(leave.type),
                          }}
                        />
                        <Chip
                          label={leave.status}
                          size="small"
                          color={leave.status === 'approved' ? 'success' : 'warning'}
                        />
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </DialogContent>
        </Dialog>
      </MotionDiv>
    </Container>
  );
};

export default Calendar;
