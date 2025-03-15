// File: src/components/auth/VerifyEmail.jsx
// Component for verifying email address

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState('verifying');
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Call the API to verify the email
        const response = await axios.get(`/api/auth/verify-email/${token}`);
        
        if (response.status === 200) {
          setVerificationStatus('success');
          console.log('Email verification successful');
        } else {
          setVerificationStatus('failed');
          setError('Verification failed. Please try again.');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setVerificationStatus('failed');
        
        if (error.response && error.response.data && error.response.data.message) {
          setError(error.response.data.message);
        } else {
          setError('Verification failed. The link may be invalid or expired.');
        }
      }
    };

    if (token) {
      verifyEmail();
    } else {
      setVerificationStatus('failed');
      setError('Invalid verification link. No token provided.');
    }
  }, [token]);

  // Redirect to login after successful verification
  useEffect(() => {
    let redirectTimer;
    if (verificationStatus === 'success') {
      redirectTimer = setTimeout(() => {
        navigate('/login', { 
          state: { 
            message: 'Your email has been verified successfully. You can now log in.' 
          } 
        });
      }, 5000); // Redirect after 5 seconds
    }
    
    return () => {
      if (redirectTimer) clearTimeout(redirectTimer);
    };
  }, [verificationStatus, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      {/* Animated background blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <motion.div 
          className="blob-1 animate-blob-slow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
        <motion.div 
          className="blob-2 animate-blob-slow animation-delay-2000"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        />
        <motion.div 
          className="blob-3 animate-blob-slow animation-delay-4000"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
        />
      </div>
      
      <motion.div 
        className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Email Verification</h1>
          
          {verificationStatus === 'verifying' && (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300">Verifying your email address...</p>
            </div>
          )}
          
          {verificationStatus === 'success' && (
            <div className="flex flex-col items-center">
              <motion.div 
                className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 p-4 rounded-full mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ duration: 0.7, type: "spring" }}
              >
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
              <motion.p 
                className="text-gray-700 dark:text-gray-300 mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                Your email has been successfully verified!
              </motion.p>
              <motion.p 
                className="text-gray-600 dark:text-gray-400 text-sm mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                You will be redirected to the login page in a few seconds...
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Link 
                  to="/login" 
                  className="btn-primary-glass text-center"
                >
                  Go to Login
                </Link>
              </motion.div>
            </div>
          )}
          
          {verificationStatus === 'failed' && (
            <div className="flex flex-col items-center">
              <motion.div 
                className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-4 rounded-full mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.div>
              <motion.p 
                className="text-red-600 dark:text-red-400 mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {error}
              </motion.p>
              <motion.div 
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Link 
                  to="/login" 
                  className="btn-primary-glass text-center"
                >
                  Go to Login
                </Link>
                <Link 
                  to="/register" 
                  className="btn-secondary-glass text-center"
                >
                  Register Again
                </Link>
              </motion.div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmail; 