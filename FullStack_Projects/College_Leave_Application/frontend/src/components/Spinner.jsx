import React from 'react';
import { Box, useTheme } from '@mui/material';
import { motion as Motion } from 'framer-motion';

const Spinner = ({ 
  size = 40, 
  thickness = 3.6, 
  overlay = false, 
  text = "Loading...",
  variant = "primary" 
}) => {
  const theme = useTheme();

  const getColors = () => {
    switch (variant) {
      case 'secondary':
        return {
          primary: theme.palette.secondary.main,
          secondary: theme.palette.secondary.light,
        };
      case 'success':
        return {
          primary: theme.palette.success.main,
          secondary: theme.palette.success.light,
        };
      default:
        return {
          primary: theme.palette.primary.main,
          secondary: theme.palette.primary.light,
        };
    }
  };

  const colors = getColors();

  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear",
      },
    },
  };

  const dotVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const textVariants = {
    animate: {
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  // Pre-compute gradient and border styles for cleaner JSX
  const dotGradient = `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`;
  const dotShadow = `0 0 ${size * 0.3}px ${colors.primary}40`;
  const borderTopStyle = `${thickness}px solid ${colors.primary}`;
  const borderRightStyle = `${thickness}px solid ${colors.secondary}`;
  const borderTransparent = `${thickness}px solid transparent`;

  const SpinnerContent = () => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
      }}
    >
      {/* Premium Gradient Spinner */}
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <Motion.div
          variants={spinnerVariants}
          animate="animate"
        >
          <Box
            sx={{
              width: size,
              height: size,
              borderRadius: '50%',
              border: borderTransparent,
              borderTop: borderTopStyle,
              borderRight: borderRightStyle,
              borderBottom: borderTransparent,
              borderLeft: borderTransparent,
            }}
          />
        </Motion.div>
        
        {/* Center dot with pulse animation */}
        <Motion.div
          variants={dotVariants}
          animate="animate"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Box
            sx={{
              width: size * 0.2,
              height: size * 0.2,
              borderRadius: '50%',
              background: dotGradient,
              boxShadow: dotShadow,
            }}
          />
        </Motion.div>
      </Box>

      {/* Animated Loading Text */}
      <Motion.div
        variants={textVariants}
        animate="animate"
      >
        <Box
          sx={{
            color: theme.palette.text.secondary,
            fontSize: '0.875rem',
            fontWeight: 500,
            letterSpacing: '0.5px',
            textAlign: 'center',
          }}
        >
          {text}
        </Box>
      </Motion.div>
    </Box>
  );

  if (overlay) {
    const overlayBorder = theme.palette.mode === 'dark' 
      ? 'rgba(255, 255, 255, 0.1)' 
      : 'rgba(0, 0, 0, 0.1)';

    return (
      <Motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            background: theme.palette.mode === 'dark' 
              ? 'rgba(15, 23, 42, 0.8)' 
              : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px) saturate(180%)',
            borderRadius: '20px',
            p: 4,
            border: `1px solid ${overlayBorder}`,
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
          }}
        >
          <SpinnerContent />
        </Box>
      </Motion.div>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '200px',
      }}
    >
      <SpinnerContent />
    </Box>
  );
};

export default Spinner;
