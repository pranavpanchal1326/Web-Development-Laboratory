import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Grid,
  Card,
  CardContent,
  Step,
  Stepper,
  StepLabel,
  IconButton,
  Avatar,
  Chip,
  Alert,
  LinearProgress,
  useTheme,
} from '@mui/material';
import {
  ArrowBack,
  CloudUpload,
  CalendarMonth,
  Description,
  Send,
  CheckCircle,
  Info,
  Assignment,
} from '@mui/icons-material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { motion, AnimatePresence } from 'framer-motion';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import applicationService from '../features/applications/applicationService';
import axios from 'axios';

// Replace with your actual Cloudinary cloud name from your console
const CLOUDINARY_CLOUD_NAME = 'dottqd8k'; // Based on your screenshot
const CLOUDINARY_UPLOAD_PRESET = 'unsigned_uploads'; // From your screenshot

// Create motion components to make usage explicit
const MotionDiv = motion.div;

const NewApplication = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [subject, setSubject] = useState('');
  const [reason, setReason] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [file, setFile] = useState(null);
  const [leaveType, setLeaveType] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const theme = useTheme();

  const steps = ['Leave Details', 'Dates & Duration', 'Supporting Document', 'Review & Submit'];

  const leaveTypes = [
    { value: 'sick', label: 'Sick Leave', color: theme.palette.error.main, desc: 'For medical reasons' },
    { value: 'casual', label: 'Casual Leave', color: theme.palette.success.main, desc: 'For personal matters' },
    { value: 'emergency', label: 'Emergency Leave', color: theme.palette.warning.main, desc: 'For urgent situations' },
    { value: 'vacation', label: 'Vacation Leave', color: theme.palette.info.main, desc: 'For planned holidays' },
    { value: 'maternity', label: 'Maternity Leave', color: theme.palette.secondary.main, desc: 'For new mothers' },
    { value: 'paternity', label: 'Paternity Leave', color: theme.palette.primary.main, desc: 'For new fathers' },
  ];

  const calculateDuration = () => {
    if (startDate && endDate) {
      return dayjs(endDate).diff(dayjs(startDate), 'days') + 1;
    }
    return 0;
  };

  const isStepValid = (step) => {
    switch (step) {
      case 0: return leaveType && subject && reason;
      case 1: return startDate && endDate && dayjs(endDate).isAfter(dayjs(startDate));
      case 2: return true; // Optional step
      case 3: return true;
      default: return false;
    }
  };

  const handleNext = () => {
    if (isStepValid(activeStep)) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleFileUpload = async (uploadedFile) => {
    if (!uploadedFile) return '';
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(uploadedFile.type)) {
      toast.error('Invalid file type. Please upload an image, PDF, or Word document.');
      return '';
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (uploadedFile.size > maxSize) {
      toast.error('File size too large. Please upload a file smaller than 10MB.');
      return '';
    }
    
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      
      // Determine resource type based on file type
      let resourceType = 'image';
      if (uploadedFile.type === 'application/pdf' || 
          uploadedFile.type === 'application/msword' || 
          uploadedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        resourceType = 'raw';
      }

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          // Add timeout to prevent hanging requests
          timeout: 30000, // 30 seconds
        }
      );

      toast.success('Document uploaded successfully!');
      return response.data.secure_url;
    } catch (error) {
      console.error('Upload error:', error);
      
      // Better error handling
      if (error.code === 'ECONNABORTED') {
        toast.error('Upload timeout. Please try again with a smaller file.');
      } else if (error.response?.data?.error?.message) {
        toast.error(`Upload failed: ${error.response.data.error.message}`);
      } else {
        toast.error('File upload failed. Please check your internet connection and try again.');
      }
      return '';
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async () => {
    setSubmitting(true);
    
    let documentUrl = '';
    if (file) {
      documentUrl = await handleFileUpload(file);
      if (!documentUrl) {
        setSubmitting(false);
        return;
      }
    }

    const applicationData = {
      subject,
      reason,
      startDate: dayjs(startDate).format('YYYY-MM-DD'),
      endDate: dayjs(endDate).format('YYYY-MM-DD'),
      leaveType,
      documentUrl,
    };

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.token) {
        toast.error('Please login to submit an application.');
        navigate('/login');
        return;
      }
      
      await applicationService.createApplication(applicationData, user.token);
      toast.success('Leave application submitted successfully!');
      navigate('/');
    } catch (error) {
      console.error('Submission error:', error);
      const message = error.response?.data?.message || error.message || error.toString();
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, type: 'spring' }
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };

  const selectedLeaveType = leaveTypes.find(type => type.value === leaveType);

  return (
    <MotionDiv
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <IconButton
            onClick={() => navigate(-1)}
            sx={{
              background: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              '&:hover': { background: theme.palette.action.hover },
            }}
          >
            <ArrowBack />
          </IconButton>
          <Box>
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
              New Leave Application
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
              Submit your leave request in easy steps
            </Typography>
          </Box>
        </Box>

        {/* Progress Stepper */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: '20px',
            p: 3,
            mb: 4,
            background: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel
                  StepIconProps={{
                    sx: {
                      '&.Mui-active': {
                        color: theme.palette.primary.main,
                      },
                      '&.Mui-completed': {
                        color: theme.palette.success.main,
                      },
                    },
                  }}
                >
                  <Typography variant="caption" sx={{ fontWeight: 500 }}>
                    {label}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>

        {/* Form Content */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: '24px',
            overflow: 'hidden',
            background: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Box sx={{ p: 4 }}>
            <AnimatePresence mode="wait">
              {/* Step 0: Leave Details */}
              {activeStep === 0 && (
                <MotionDiv
                  key="step0"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Assignment sx={{ color: theme.palette.primary.main }} />
                    Leave Details
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                        Select Leave Type
                      </Typography>
                      <Grid container spacing={2}>
                        {leaveTypes.map((type) => (
                          <Grid item xs={12} sm={6} key={type.value}>
                            <Card
                              onClick={() => setLeaveType(type.value)}
                              sx={{
                                cursor: 'pointer',
                                borderRadius: '16px',
                                border: leaveType === type.value 
                                  ? `2px solid ${type.color}` 
                                  : `1px solid ${theme.palette.divider}`,
                                background: leaveType === type.value 
                                  ? `${type.color}08` 
                                  : theme.palette.background.paper,
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                  border: `2px solid ${type.color}`,
                                  transform: 'translateY(-2px)',
                                },
                              }}
                            >
                              <CardContent sx={{ p: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                  <Box
                                    sx={{
                                      width: 12,
                                      height: 12,
                                      borderRadius: '50%',
                                      background: type.color,
                                    }}
                                  />
                                  <Box>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                      {type.label}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {type.desc}
                                    </Typography>
                                  </Box>
                                </Box>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Brief title for your leave request"
                        required
                        error={subject.length > 0 && subject.length < 3}
                        helperText={subject.length > 0 && subject.length < 3 ? "Subject must be at least 3 characters" : ""}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Reason"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        multiline
                        rows={4}
                        placeholder="Provide a detailed reason for your leave request"
                        required
                        error={reason.length > 0 && reason.length < 10}
                        helperText={reason.length > 0 && reason.length < 10 ? "Reason must be at least 10 characters" : ""}
                      />
                    </Grid>
                  </Grid>
                </MotionDiv>
              )}

              {/* Step 1: Dates */}
              {activeStep === 1 && (
                <MotionDiv
                  key="step1"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarMonth sx={{ color: theme.palette.primary.main }} />
                    Select Dates
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label="Start Date"
                          value={startDate}
                          onChange={setStartDate}
                          minDate={dayjs()}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              required: true,
                            },
                          }}
                        />
                      </LocalizationProvider>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label="End Date"
                          value={endDate}
                          onChange={setEndDate}
                          minDate={startDate || dayjs()}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              required: true,
                            },
                          }}
                        />
                      </LocalizationProvider>
                    </Grid>

                    {startDate && endDate && (
                      <Grid item xs={12}>
                        <Alert
                          severity="info"
                          sx={{ borderRadius: '12px' }}
                          icon={<Info />}
                        >
                          <Typography variant="body2">
                            <strong>Duration:</strong> {calculateDuration()} day{calculateDuration() !== 1 ? 's' : ''} 
                            ({dayjs(startDate).format('MMM DD')} to {dayjs(endDate).format('MMM DD, YYYY')})
                          </Typography>
                        </Alert>
                      </Grid>
                    )}
                  </Grid>
                </MotionDiv>
              )}

              {/* Step 2: Document Upload */}
              {activeStep === 2 && (
                <MotionDiv
                  key="step2"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CloudUpload sx={{ color: theme.palette.primary.main }} />
                    Supporting Document
                  </Typography>

                  <Box
                    sx={{
                      border: `2px dashed ${theme.palette.divider}`,
                      borderRadius: '16px',
                      p: 4,
                      textAlign: 'center',
                      background: file ? `${theme.palette.success.main}08` : 'transparent',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <input
                      type="file"
                      id="file-upload"
                      hidden
                      accept="image/jpeg,image/jpg,image/png,image/gif,application/pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={(e) => setFile(e.target.files[0])}
                    />
                    <label htmlFor="file-upload" style={{ cursor: 'pointer' }}>
                      <CloudUpload 
                        sx={{ 
                          fontSize: 48, 
                          color: file ? theme.palette.success.main : theme.palette.text.secondary,
                          mb: 2 
                        }} 
                      />
                      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                        {file ? 'Document Selected' : 'Upload Supporting Document'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {file ? file.name : 'Optional: Medical certificate, official letter, etc.'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                        Accepted formats: Images (JPEG, PNG, GIF), PDF, Word documents (max 10MB)
                      </Typography>
                    </label>

                    {file && (
                      <Box sx={{ mt: 2 }}>
                        <Chip
                          label={file.name}
                          onDelete={() => setFile(null)}
                          sx={{ mt: 1 }}
                          color="success"
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                          File size: {(file.size / 1024 / 1024).toFixed(2)} MB
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </MotionDiv>
              )}

              {/* Step 3: Review */}
              {activeStep === 3 && (
                <MotionDiv
                  key="step3"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircle sx={{ color: theme.palette.success.main }} />
                    Review & Submit
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Card sx={{ borderRadius: '16px', background: `${selectedLeaveType?.color}08` }}>
                        <CardContent>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                            Leave Details
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Chip 
                              label={selectedLeaveType?.label}
                              sx={{ 
                                background: selectedLeaveType?.color,
                                color: 'white',
                                fontWeight: 600 
                              }}
                            />
                          </Box>
                          <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                            {subject}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {reason}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Card sx={{ borderRadius: '16px' }}>
                        <CardContent>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                            Duration & Dates
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <CalendarMonth sx={{ fontSize: 20, color: theme.palette.primary.main }} />
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              {calculateDuration()} day{calculateDuration() !== 1 ? 's' : ''}
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            From {dayjs(startDate).format('MMMM DD, YYYY')}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            To {dayjs(endDate).format('MMMM DD, YYYY')}
                          </Typography>
                          {file && (
                            <Box sx={{ mt: 2 }}>
                              <Typography variant="caption" color="text.secondary">
                                Supporting Document:
                              </Typography>
                              <Chip label={file.name} size="small" sx={{ ml: 1 }} />
                            </Box>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={12}>
                      <Alert severity="info" sx={{ borderRadius: '12px' }}>
                        Please review all details carefully. Once submitted, your application will be sent for approval.
                      </Alert>
                    </Grid>
                  </Grid>
                </MotionDiv>
              )}
            </AnimatePresence>
          </Box>

          {/* Navigation Buttons */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              p: 3,
              pt: 0,
              gap: 2,
            }}
          >
            <Button
              onClick={activeStep === 0 ? () => navigate(-1) : handleBack}
              variant="outlined"
              startIcon={<ArrowBack />}
              sx={{ borderRadius: '12px', px: 3 }}
            >
              {activeStep === 0 ? 'Cancel' : 'Back'}
            </Button>

            <Box sx={{ flex: 1, mx: 2 }}>
              {(submitting || uploading) && (
                <LinearProgress 
                  sx={{ 
                    borderRadius: '4px',
                    height: 6,
                    mt: 1,
                  }} 
                />
              )}
            </Box>

            {activeStep === steps.length - 1 ? (
              <Button
                onClick={onSubmit}
                variant="contained"
                disabled={!isStepValid(activeStep) || submitting || uploading}
                endIcon={submitting ? null : <Send />}
                sx={{
                  borderRadius: '12px',
                  px: 4,
                  background: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.light})`,
                  '&:hover': {
                    background: `linear-gradient(135deg, ${theme.palette.success.dark}, ${theme.palette.success.main})`,
                  },
                }}
              >
                {submitting ? 'Submitting...' : uploading ? 'Uploading...' : 'Submit Application'}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                variant="contained"
                disabled={!isStepValid(activeStep)}
                sx={{
                  borderRadius: '12px',
                  px: 4,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                }}
              >
                Next Step
              </Button>
            )}
          </Box>
        </Paper>
      </Container>
    </MotionDiv>
  );
};

export default NewApplication;
