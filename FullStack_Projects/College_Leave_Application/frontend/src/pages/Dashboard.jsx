import React, { Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StudentDashboard from './StudentDashboard';
import StaffDashboard from './StaffDashboard';
import AdminDashboard from './AdminDashboard';
import Spinner from '../components/Spinner';

// Create motion component to make usage explicit
const MotionDiv = motion.div;

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = user.role || 'student';

  const pageVariants = {
    initial: { opacity: 0, scale: 0.95 },
    in: { opacity: 1, scale: 1 },
    out: { opacity: 0, scale: 1.05 }
  };

  const pageTransition = {
    type: 'spring',
    stiffness: 100,
    damping: 20,
    duration: 0.4
  };

  const renderDashboard = () => {
    switch (role) {
      case 'admin':
        return <AdminDashboard key="admin" />;
      case 'staff':
        return <StaffDashboard key="staff" />;
      default:
        return <StudentDashboard key="student" />;
    }
  };

  return (
    <Suspense fallback={<Spinner overlay text="Loading dashboard..." />}>
      <AnimatePresence mode="wait">
        <MotionDiv
          variants={pageVariants}
          initial="initial"
          animate="in"
          exit="out"
          transition={pageTransition}
        >
          {renderDashboard()}
        </MotionDiv>
      </AnimatePresence>
    </Suspense>
  );
};

export default Dashboard;
