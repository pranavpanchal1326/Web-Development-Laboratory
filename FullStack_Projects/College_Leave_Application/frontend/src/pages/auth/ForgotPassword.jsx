import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  InputAdornment,
  Link,
  useTheme,
} from '@mui/material';
import {
  MailOutline,
  ArrowBack,
  Send,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import { toast } from 'react-toastify';
import authService from '../../features/auth/authService';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const theme = useTheme();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.forgotPassword({ email });
      setSent(true);
      toast.success('Password reset link sent! Check your email. 📧');
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong, please try again.');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, type: 'spring' } },
  };

  // Pre-compute gradient strings to avoid template literal issues
  const headerGradient = `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`;
  const titleGradient = `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`;
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
            borderRadius: '24px',
            p: 4,
            background: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
          }}
        >
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '20px',
                background: headerGradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
                boxShadow: '0 10px 30px rgba(30, 64, 175, 0.3)',
              }}
            >
              <MailOutline sx={{ color: 'white', fontSize: 40 }} />
            </Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                mb: 1,
                background: titleGradient,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Forgot Password?
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto' }}>
              {sent
                ? "We've sent a password reset link to your email address. Please check your inbox and follow the instructions."
                : "No worries! Enter your email address and we'll send you a link to reset your password."}
            </Typography>
          </Box>

          {!sent ? (
            <Box component="form" onSubmit={onSubmit} noValidate>
              <TextField
                type="email"
                label="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                required
                autoFocus
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MailOutline sx={{ color: theme.palette.text.secondary }} />
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
                disabled={loading}
                endIcon={loading ? null : <Send />}
                sx={{
                  py: 1.5,
                  borderRadius: '12px',
                  background: buttonGradient,
                  boxShadow: '0 8px 25px rgba(30, 64, 175, 0.3)',
                  fontWeight: 600,
                  mb: 3,
                  '&:hover': {
                    background: buttonHoverGradient,
                    boxShadow: '0 12px 30px rgba(30, 64, 175, 0.4)',
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </Box>
          ) : (
            <Box sx={{ mb: 3 }}>
              <Button
                onClick={() => setSent(false)}
                variant="outlined"
                sx={{ borderRadius: '12px', mr: 2 }}
              >
                Resend Email
              </Button>
            </Box>
          )}

          <Link
            component={RouterLink}
            to="/login"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              color: theme.palette.text.secondary,
              textDecoration: 'none',
              fontWeight: 500,
              '&:hover': {
                color: theme.palette.primary.main,
                textDecoration: 'underline',
              },
            }}
          >
            <ArrowBack fontSize="small" />
            Back to Login
          </Link>
        </Paper>
      </Motion.div>
    </Container>
  );
};

export default ForgotPassword;
