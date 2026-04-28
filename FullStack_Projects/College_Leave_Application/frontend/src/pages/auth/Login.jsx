import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Link,
  Paper,
  IconButton,
  InputAdornment,
  useTheme,
} from '@mui/material';
import {
  LockOutlined,
  Visibility,
  VisibilityOff,
  School,
  Email,
  ArrowForward,
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import { toast } from 'react-toastify';
import authService from '../../features/auth/authService';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { email, password } = formData;
  const navigate = useNavigate();
  const theme = useTheme();

  const onChange = (e) => {
    setFormData(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await authService.login({ email, password });
      toast.success(`Welcome back, ${user.name}! 🎉`);
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
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        type: 'spring',
      },
    }),
  };

  // Pre-compute gradient strings to avoid template literal issues in JSX
  const logoGradient = `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`;
  const buttonGradient = `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`;
  const buttonHoverGradient = `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`;

  return (
    <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', py: 4 }}>
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
            p: 4,
            background: theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.05)'
              : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          }}
        >
          {/* Header */}
          <Motion.div
            variants={itemVariants}
            custom={0}
            style={{ textAlign: 'center', marginBottom: '2rem' }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '20px',
                  background: logoGradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 10px 30px rgba(30, 64, 175, 0.3)',
                  position: 'relative',
                }}
              >
                <School sx={{ color: 'white', fontSize: 40 }} />
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
                  <LockOutlined sx={{ color: 'white', fontSize: 12 }} />
                </Box>
              </Box>
            </Box>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                mb: 1,
                background: logoGradient,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Welcome Back! 👋
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
              Sign in to continue to EduLeave
            </Typography>
          </Motion.div>

          {/* Form */}
          <Box component="form" onSubmit={onSubmit} noValidate>
            <Motion.div variants={itemVariants} custom={1}>
              <TextField
                name="email"
                type="email"
                label="Email Address"
                value={email}
                onChange={onChange}
                fullWidth
                required
                margin="normal"
                autoFocus
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: theme.palette.text.secondary }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '14px',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 4px 20px rgba(30, 64, 175, 0.15)',
                    },
                    '&.Mui-focused': {
                      boxShadow: '0 4px 20px rgba(30, 64, 175, 0.25)',
                    },
                  },
                }}
              />
            </Motion.div>

            <Motion.div variants={itemVariants} custom={2}>
              <TextField
                name="password"
                type={showPassword ? 'text' : 'password'}
                label="Password"
                value={password}
                onChange={onChange}
                fullWidth
                required
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined sx={{ color: theme.palette.text.secondary }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ mr: -1 }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '14px',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 4px 20px rgba(30, 64, 175, 0.15)',
                    },
                    '&.Mui-focused': {
                      boxShadow: '0 4px 20px rgba(30, 64, 175, 0.25)',
                    },
                  },
                }}
              />
            </Motion.div>

            <Motion.div variants={itemVariants} custom={3}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                endIcon={loading ? null : <ArrowForward />}
                sx={{
                  py: 1.5,
                  borderRadius: '14px',
                  background: buttonGradient,
                  boxShadow: '0 8px 25px rgba(30, 64, 175, 0.3)',
                  fontWeight: 700,
                  fontSize: '1rem',
                  textTransform: 'none',
                  mb: 3,
                  '&:hover': {
                    background: buttonHoverGradient,
                    boxShadow: '0 12px 30px rgba(30, 64, 175, 0.4)',
                    transform: 'translateY(-2px)',
                  },
                  '&:disabled': {
                    background: theme.palette.action.disabledBackground,
                    boxShadow: 'none',
                  },
                }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </Motion.div>

            {/* Links */}
            <Motion.div variants={itemVariants} custom={4}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Link
                    component={RouterLink}
                    to="/forgot-password"
                    variant="body2"
                    sx={{
                      color: theme.palette.primary.main,
                      textDecoration: 'none',
                      fontWeight: 600,
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item xs={6} sx={{ textAlign: 'right' }}>
                  <Link
                    component={RouterLink}
                    to="/register"
                    variant="body2"
                    sx={{
                      color: theme.palette.secondary.main,
                      textDecoration: 'none',
                      fontWeight: 600,
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Create Account
                  </Link>
                </Grid>
              </Grid>
            </Motion.div>
          </Box>
        </Paper>
      </Motion.div>
    </Container>
  );
};

export default Login;
