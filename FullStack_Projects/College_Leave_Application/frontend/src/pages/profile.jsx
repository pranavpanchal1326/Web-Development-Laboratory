// pages/Profile.jsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  Grid,
  Avatar,
  Card,
  CardContent,
  Chip,
  Divider,
  Alert,
  useTheme,
} from '@mui/material';
import {
  Person,
  Email,
  Work,
  Phone,
  LocationOn,
  Edit,
  Save,
  Cancel,
  CameraAlt,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const MotionDiv = motion.div;

const Profile = () => {
  const [editing, setEditing] = useState(false);
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@company.com',
    employeeId: 'EMP001',
    department: 'Software Development',
    position: 'Senior Developer',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
    joinDate: '2022-01-15',
    manager: 'Jane Smith',
    profileImage: null,
  });
  
  const theme = useTheme();

  const handleSave = () => {
    // Save user data logic here
    setEditing(false);
    // toast.success('Profile updated successfully!');
  };

  const handleCancel = () => {
    // Reset form data
    setEditing(false);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUser(prev => ({ ...prev, profileImage: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

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
            My Profile
          </Typography>
          <Button
            variant={editing ? "outlined" : "contained"}
            startIcon={editing ? <Cancel /> : <Edit />}
            onClick={() => editing ? handleCancel() : setEditing(true)}
            sx={{ borderRadius: '12px' }}
          >
            {editing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </Box>

        <Grid container spacing={4}>
          {/* Profile Card */}
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: '20px', textAlign: 'center', p: 3 }}>
              <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                <Avatar
                  src={user.profileImage}
                  sx={{
                    width: 120,
                    height: 120,
                    fontSize: '48px',
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  }}
                >
                  {user.name.split(' ').map(n => n[0]).join('')}
                </Avatar>
                {editing && (
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      background: theme.palette.primary.main,
                      borderRadius: '50%',
                      width: 32,
                      height: 32,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      '&:hover': { background: theme.palette.primary.dark },
                    }}
                    component="label"
                  >
                    <CameraAlt sx={{ fontSize: 16, color: 'white' }} />
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </Box>
                )}
              </Box>
              
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                {user.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {user.position}
              </Typography>
              <Chip
                label={user.department}
                sx={{
                  background: `${theme.palette.primary.main}20`,
                  color: theme.palette.primary.main,
                  fontWeight: 600,
                }}
              />
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ textAlign: 'left' }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Employee ID: <strong>{user.employeeId}</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Join Date: <strong>{new Date(user.joinDate).toLocaleDateString()}</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Reports to: <strong>{user.manager}</strong>
                </Typography>
              </Box>
            </Card>
          </Grid>

          {/* Details Form */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ borderRadius: '20px', p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Personal Information
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={user.name}
                    onChange={(e) => setUser(prev => ({ ...prev, name: e.target.value }))}
                    disabled={!editing}
                    InputProps={{
                      startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    value={user.email}
                    onChange={(e) => setUser(prev => ({ ...prev, email: e.target.value }))}
                    disabled={!editing}
                    InputProps={{
                      startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={user.phone}
                    onChange={(e) => setUser(prev => ({ ...prev, phone: e.target.value }))}
                    disabled={!editing}
                    InputProps={{
                      startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Location"
                    value={user.location}
                    onChange={(e) => setUser(prev => ({ ...prev, location: e.target.value }))}
                    disabled={!editing}
                    InputProps={{
                      startAdornment: <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Position"
                    value={user.position}
                    onChange={(e) => setUser(prev => ({ ...prev, position: e.target.value }))}
                    disabled={!editing}
                    InputProps={{
                      startAdornment: <Work sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Department"
                    value={user.department}
                    onChange={(e) => setUser(prev => ({ ...prev, department: e.target.value }))}
                    disabled={!editing}
                  />
                </Grid>
              </Grid>
              
              {editing && (
                <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={handleCancel}
                    sx={{ borderRadius: '12px' }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSave}
                    sx={{ borderRadius: '12px' }}
                  >
                    Save Changes
                  </Button>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </MotionDiv>
    </Container>
  );
};

export default Profile;
