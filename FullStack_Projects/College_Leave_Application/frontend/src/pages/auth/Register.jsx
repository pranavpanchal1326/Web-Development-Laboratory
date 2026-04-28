import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  useTheme,
} from '@mui/material';
import {
  Person,
  Email,
  LockOutlined,
  Visibility,
  VisibilityOff,
  School,
  Badge,
  ArrowForward,
  ArrowBack,
  CheckCircle,
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import authService from '../../features/auth/authService';

const Register = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
    role: 'student',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const theme = useTheme();
  const steps = ['Personal Info', 'Account Setup', 'Complete'];

  const { name, email, password, password2, role } = formData;

  const onChange = (e) => {
    setFormData(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const isStepValid = (step) => {
    switch (step) {
      case 0:
        return name.length >= 2 && email.includes('@');
      case 1:
        return password.length >= 6 && password === password2 && role;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (isStepValid(activeStep)) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const userData = { name, email, password, role };
      const user = await authService.register(userData);
      toast.success(`Welcome to EduLeave, ${user.name}! 🎉`);
      navigate('/');
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, type: 'spring' } },
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  // Pre-compute gradient strings to avoid template literal issues in JSX
  const headerGradient = `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`;
  const successButtonGradient = `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.light})`;
  const successButtonHoverGradient = `linear-gradient(135deg, ${theme.palette.success.dark}, ${theme.palette.success.main})`;

  return (
    <Container maxWidth="md" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', py: 4 }}>
      <Motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ width: '100%' }}
      >
        <Paper
          elevation={0}
          sx={{
            borderRadius: '32px',
            overflow: 'hidden',
            background: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background: headerGradient,
              p: 4,
              color: 'white',
              textAlign: 'center',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '20px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <School sx={{ fontSize: 40 }} />
              </Box>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
              Join EduLeave Pro
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 500 }}>
              Create your account in easy steps
            </Typography>
          </Box>

          {/* Progress Stepper */}
          <Box sx={{ px: 4, pt: 3 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label, index) => (
                <Step key={label} completed={activeStep > index}>
                  <StepLabel
                    StepIconProps={{
                      sx: {
                        '&.Mui-active': { color: theme.palette.primary.main },
                        '&.Mui-completed': { color: theme.palette.success.main },
                      },
                    }}
                  >
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                      {label}
                    </Typography>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          {/* Form Content */}
          <Box sx={{ p: 4 }}>
            <AnimatePresence mode="wait">
              {/* Step 0: Personal Info */}
              {activeStep === 0 && (
                <Motion.div
                  key="step0"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Person sx={{ color: theme.palette.primary.main }} />
                    Personal Information
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        name="name"
                        label="Full Name"
                        value={name}
                        onChange={onChange}
                        fullWidth
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Person sx={{ color: theme.palette.text.secondary }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        name="email"
                        type="email"
                        label="Email Address"
                        value={email}
                        onChange={onChange}
                        fullWidth
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Email sx={{ color: theme.palette.text.secondary }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </Motion.div>
              )}

              {/* Step 1: Account Setup */}
              {activeStep === 1 && (
                <Motion.div
                  key="step1"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LockOutlined sx={{ color: theme.palette.primary.main }} />
                    Account Security
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel>Role</InputLabel>
                        <Select
                          name="role"
                          value={role}
                          onChange={onChange}
                          label="Role"
                          startAdornment={
                            <InputAdornment position="start">
                              <Badge sx={{ color: theme.palette.text.secondary, mr: 1 }} />
                            </InputAdornment>
                          }
                          sx={{
                            borderRadius: '12px',
                          }}
                        >
                          <MenuItem value="student">Student</MenuItem>
                          <MenuItem value="staff">Staff</MenuItem>
                          <MenuItem value="admin">Administrator</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        label="Password"
                        value={password}
                        onChange={onChange}
                        fullWidth
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockOutlined sx={{ color: theme.palette.text.secondary }} />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="password2"
                        type={showPassword2 ? 'text' : 'password'}
                        label="Confirm Password"
                        value={password2}
                        onChange={onChange}
                        fullWidth
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockOutlined sx={{ color: theme.palette.text.secondary }} />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={() => setShowPassword2(!showPassword2)}>
                                {showPassword2 ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </Motion.div>
              )}

              {/* Step 2: Complete */}
              {activeStep === 2 && (
                <Motion.div
                  key="step2"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <CheckCircle 
                      sx={{ 
                        fontSize: 80, 
                        color: theme.palette.success.main, 
                        mb: 2 
                      }} 
                    />
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                      Ready to Create Account
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                      Please review your information and click Create Account to continue.
                    </Typography>
                    
                    <Paper
                      sx={{
                        p: 3,
                        borderRadius: '16px',
                        background: theme.palette.background.default,
                        border: `1px solid ${theme.palette.divider}`,
                        textAlign: 'left',
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                        Account Summary
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Name:</strong> {name}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Email:</strong> {email}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Role:</strong> {role.charAt(0).toUpperCase() + role.slice(1)}
                      </Typography>
                    </Paper>
                  </Box>
                </Motion.div>
              )}
            </AnimatePresence>
          </Box>

          {/* Navigation */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 4, pt: 0 }}>
            <Button
              onClick={activeStep === 0 ? () => navigate('/login') : handleBack}
              startIcon={<ArrowBack />}
              variant="outlined"
              sx={{ borderRadius: '12px', px: 3 }}
            >
              {activeStep === 0 ? 'Back to Login' : 'Back'}
            </Button>

            {activeStep === steps.length - 1 ? (
              <Button
                onClick={onSubmit}
                disabled={!isStepValid(activeStep) || loading}
                endIcon={loading ? null : <CheckCircle />}
                variant="contained"
                sx={{
                  borderRadius: '12px',
                  px: 4,
                  background: successButtonGradient,
                  '&:hover': {
                    background: successButtonHoverGradient,
                  },
                }}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!isStepValid(activeStep)}
                endIcon={<ArrowForward />}
                variant="contained"
                sx={{ borderRadius: '12px', px: 4 }}
              >
                Next
              </Button>
            )}
          </Box>
        </Paper>
      </Motion.div>
    </Container>
  );
};

export default Register;
