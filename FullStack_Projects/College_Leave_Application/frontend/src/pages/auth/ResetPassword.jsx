import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  InputAdornment,
  IconButton,
  LinearProgress,
  useTheme,
} from '@mui/material';
import {
  LockReset,
  Visibility,
  VisibilityOff,
  Security,
  CheckCircle,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import authService from '../../features/auth/authService';

// Create motion component to make usage explicit
const MotionDiv = motion.div;

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams();
  const theme = useTheme();

  const getPasswordStrength = (pwd) => {
    let strength = 0;
    if (pwd.length >= 8) strength += 25;
    if (/[a-z]/.test(pwd)) strength += 25;
    if (/[A-Z]/.test(pwd)) strength += 25;
    if (/[0-9!@#$%^&*]/.test(pwd)) strength += 25;
    return strength;
  };

  const passwordStrength = getPasswordStrength(password);
  const strengthColor = 
    passwordStrength >= 75 ? theme.palette.success.main :
    passwordStrength >= 50 ? theme.palette.warning.main :
    theme.palette.error.main;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwordStrength < 75) {
      toast.error('Please choose a stronger password');
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword(token, { password });
      toast.success('Password reset successfully! Welcome back! 🎉');
      navigate('/');
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.message || error.message || 'Token is invalid or has expired.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, type: 'spring' } },
  };

  return (
    <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', py: 4 }}>
      <MotionDiv
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ width: '100%' }}
      >
        <Paper
          elevation={0}
          sx={{
            borderRadius: '24px',
            p: 4,
            background: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '20px',
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
                boxShadow: '0 10px 30px rgba(30, 64, 175, 0.3)',
                position: 'relative',
              }}
            >
              <LockReset sx={{ color: 'white', fontSize: 40 }} />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: -5,
                  right: -5,
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: theme.palette.success.main,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `3px solid ${theme.palette.background.paper}`,
                }}
              >
                <Security sx={{ color: 'white', fontSize: 12 }} />
              </Box>
            </Box>
            
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                mb: 1,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Reset Password 🔐
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto' }}>
              Choose a strong password to secure your account
            </Typography>
          </Box>

          {/* Form */}
          <Box component="form" onSubmit={onSubmit} noValidate>
            <TextField
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              required
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockReset sx={{ color: theme.palette.text.secondary }} />
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
                mb: 1,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '&:hover': {
                    boxShadow: '0 4px 20px rgba(30, 64, 175, 0.15)',
                  },
                  '&.Mui-focused': {
                    boxShadow: '0 4px 20px rgba(30, 64, 175, 0.25)',
                  },
                },
              }}
            />

            {/* Password Strength Indicator */}
            {password && (
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Password Strength
                  </Typography>
                  <Typography variant="caption" sx={{ color: strengthColor, fontWeight: 600 }}>
                    {passwordStrength >= 75 ? 'Strong' : passwordStrength >= 50 ? 'Medium' : 'Weak'}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={passwordStrength}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: `${strengthColor}20`,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: strengthColor,
                      borderRadius: 3,
                    },
                  }}
                />
              </Box>
            )}

            <TextField
              label="Confirm Password"
              type={showPassword2 ? 'text' : 'password'}
              fullWidth
              required
              margin="normal"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              error={password2 && password !== password2}
              helperText={password2 && password !== password2 ? 'Passwords do not match' : ''}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {password2 && password === password2 ? (
                      <CheckCircle sx={{ color: theme.palette.success.main }} />
                    ) : (
                      <LockReset sx={{ color: theme.palette.text.secondary }} />
                    )}
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
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '&:hover': {
                    boxShadow: '0 4px 20px rgba(30, 64, 175, 0.15)',
                  },
                  '&.Mui-focused': {
                    boxShadow: '0 4px 20px rgba(30, 64, 175, 0.25)',
                  },
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading || passwordStrength < 75 || password !== password2}
              sx={{
                py: 1.5,
                borderRadius: '12px',
                background: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.light})`,
                boxShadow: '0 8px 25px rgba(5, 150, 105, 0.3)',
                fontWeight: 600,
                '&:hover': {
                  background: `linear-gradient(135deg, ${theme.palette.success.dark}, ${theme.palette.success.main})`,
                  boxShadow: '0 12px 30px rgba(5, 150, 105, 0.4)',
                  transform: 'translateY(-1px)',
                },
                '&:disabled': {
                  background: theme.palette.action.disabledBackground,
                  boxShadow: 'none',
                },
              }}
            >
              {loading ? 'Updating Password...' : 'Set New Password'}
            </Button>
          </Box>
        </Paper>
      </MotionDiv>
    </Container>
  );
};

export default ResetPassword;
