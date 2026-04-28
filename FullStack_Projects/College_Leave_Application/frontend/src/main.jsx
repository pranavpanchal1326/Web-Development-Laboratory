import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { motion, AnimatePresence } from 'framer-motion';
import App from './App.jsx';
import './index.css';
import { createAppTheme } from './theme/theme.js';

// Create motion components to make usage explicit
const MotionDiv = motion.div;
const MotionButton = motion.button;

// Enhanced error boundary for production-ready error handling
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Application Error:', error, errorInfo);
    
    // In production, you might want to send this to an error reporting service
    if (import.meta.env.PROD) {
      // Example: Sentry.captureException(error);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <MotionDiv
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: 'spring' }}
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            textAlign: 'center',
            padding: '2rem',
          }}
        >
          <MotionDiv
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              padding: '3rem',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
              maxWidth: '500px',
            }}
          >
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚠️</div>
            <h1 style={{ 
              fontSize: '2rem', 
              fontWeight: '800', 
              marginBottom: '1rem',
              background: 'linear-gradient(135deg, #fff, #f0f0f0)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Oops! Something went wrong
            </h1>
            <p style={{ 
              fontSize: '1.1rem', 
              marginBottom: '2rem', 
              opacity: 0.9,
              lineHeight: 1.6,
            }}>
              We're sorry for the inconvenience. Please refresh the page or contact support if the problem persists.
            </p>
            <MotionButton
              whileHover={{ scale: 1.05, boxShadow: '0 8px 25px rgba(255, 255, 255, 0.3)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.reload()}
              style={{
                background: 'linear-gradient(135deg, #fff, #f0f0f0)',
                color: '#1f2937',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 24px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              Refresh Page
            </MotionButton>
          </MotionDiv>
        </MotionDiv>
      );
    }

    return this.props.children;
  }
}

// Performance monitoring and initialization
const initializeApp = () => {
  // Performance tracking
  if (typeof window !== 'undefined') {
    // Track initial load performance
    window.addEventListener('load', () => {
      const perfData = performance.getEntriesByType('navigation')[0];
      console.log('🚀 App Load Performance:', {
        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
        loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
        totalTime: perfData.loadEventEnd - perfData.fetchStart,
      });
    });

    // Add theme detection and storage
    const savedTheme = localStorage.getItem('eduLeaveTheme');
    if (!savedTheme) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      localStorage.setItem('eduLeaveTheme', prefersDark ? 'dark' : 'light');
    }
  }
};

// Initialize theme with user preference
const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'light';
  
  const savedTheme = localStorage.getItem('eduLeaveTheme');
  if (savedTheme) return savedTheme;
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

// Enhanced App wrapper with global providers
const AppWrapper = () => {
  const [themeMode, setThemeMode] = React.useState(getInitialTheme());
  const [isLoading, setIsLoading] = React.useState(true);

  // Theme toggle function
  const toggleTheme = React.useCallback(() => {
    const newMode = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newMode);
    localStorage.setItem('eduLeaveTheme', newMode);
    document.body.setAttribute('data-theme', newMode);
  }, [themeMode]);

  // Create theme based on current mode
  const currentTheme = React.useMemo(() => createAppTheme(themeMode), [themeMode]);

  // Initialize app
  React.useEffect(() => {
    initializeApp();
    
    // Set initial theme attribute
    document.body.setAttribute('data-theme', themeMode);
    
    // Simulate initial loading for smooth experience
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [themeMode]);

  // Loading screen component
  const LoadingScreen = () => (
    <MotionDiv
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: themeMode === 'dark' 
          ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)'
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      <MotionDiv
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, type: 'spring' }}
        style={{
          textAlign: 'center',
          color: 'white',
        }}
      >
        {/* Premium Loading Animation */}
        <MotionDiv
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            border: '3px solid rgba(255, 255, 255, 0.3)',
            borderTop: '3px solid white',
            margin: '0 auto 2rem',
          }}
        />
        
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            marginBottom: '1rem',
            background: 'linear-gradient(135deg, #fff, #f0f0f0)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          EduLeave Pro
        </motion.h1>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            fontSize: '1.1rem',
            opacity: 0.9,
            fontWeight: 500,
          }}
        >
          Initializing your premium experience...
        </motion.p>
        
        {/* Loading Progress Bar */}
        <MotionDiv
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          style={{
            height: 4,
            background: 'linear-gradient(135deg, #fff, #f0f0f0)',
            borderRadius: 2,
            marginTop: '2rem',
            maxWidth: 200,
            margin: '2rem auto 0',
          }}
        />
      </MotionDiv>
    </MotionDiv>
  );

  return (
    <ErrorBoundary>
      <ThemeProvider theme={currentTheme}>
        <CssBaseline enableColorScheme />
        
        {/* Global theme context for child components */}
        <div id="theme-provider" data-theme={themeMode}>
          <AnimatePresence mode="wait">
            {isLoading ? (
              <LoadingScreen key="loading" />
            ) : (
              <MotionDiv
                key="app"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
              >
                <App themeMode={themeMode} toggleTheme={toggleTheme} />
              </MotionDiv>
            )}
          </AnimatePresence>
        </div>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

// Service Worker registration for PWA capabilities
const registerServiceWorker = () => {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('🔧 SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('❌ SW registration failed: ', registrationError);
        });
    });
  }
};

// Performance observer for monitoring
const observePerformance = () => {
  if ('PerformanceObserver' in window) {
    const perfObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.entryType === 'largest-contentful-paint') {
          console.log('🎯 LCP:', entry.startTime);
        }
        if (entry.entryType === 'first-input') {
          console.log('👆 FID:', entry.processingStart - entry.startTime);
        }
      });
    });

    try {
      perfObserver.observe({ entryTypes: ['largest-contentful-paint', 'first-input'] });
    } catch {
      // Performance observer not supported
      console.warn('Performance observer not supported');
    }
  }
};

// Initialize performance monitoring
observePerformance();
registerServiceWorker();

// Enhanced root render with React 18 features
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
);

// Hot module replacement for development
if (import.meta.hot) {
  import.meta.hot.accept();
}

// Global error handler for unhandled promises
window.addEventListener('unhandledrejection', (event) => {
  console.error('🚨 Unhandled promise rejection:', event.reason);
  
  // Prevent the default browser error page
  event.preventDefault();
  
  // In production, you might want to show a user-friendly message
  if (import.meta.env.PROD) {
    // Show toast notification or modal
    console.log('Showing user-friendly error message...');
  }
});

// Export components to satisfy fast refresh rule
export default AppWrapper;
