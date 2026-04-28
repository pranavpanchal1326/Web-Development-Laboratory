import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import Spinner from './Spinner';

const PrivateRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Simulate auth check with smooth loading
    const checkAuth = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      
      // Add a small delay for smooth UX
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setIsAuthenticated(!!user?.token);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const pageVariants = {
    initial: {
      opacity: 0,
      scale: 0.8,
      y: 50,
    },
    in: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.6,
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
    out: {
      opacity: 0,
      scale: 1.2,
      y: -50,
      transition: {
        duration: 0.3,
      },
    },
  };

  if (isLoading) {
    return (
      <Spinner 
        overlay 
        text="Verifying access..." 
        size={50}
      />
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AnimatePresence mode="wait">
      <Motion.div
        key="protected-content"
        variants={pageVariants}
        initial="initial"
        animate="in"
        exit="out"
        style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
      >
        {children}
      </Motion.div>
    </AnimatePresence>
  );
};

export default PrivateRoute;
