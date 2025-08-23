// Login.jsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Snackbar,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);

      // ✅ Auto login: store username (and maybe token if backend sends it)
      localStorage.setItem('username', res.data.username);

      // ✅ Show success toast
      setSuccess(true);

      // ✅ Navigate to chat after short delay
      setTimeout(() => {
        navigate('/chat', { state: { username: res.data.username } });
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f5f6fa',
        px: 2,
      }}
    >
      {/* Header */}
      <Box textAlign="center" mb={4}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Login
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          maxWidth={400}
          mx="auto"
        >
          Enter your credentials to access ChatFlow and start chatting in
          real-time.
        </Typography>
      </Box>

      {/* Login Form */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ width: '100%', maxWidth: 400 }}
      >
        <Stack spacing={2}>
          <TextField
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            required
          />
          {error && <Typography color="error">{error}</Typography>}
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Login
          </Button>
        </Stack>
      </Box>

      {/* Footer */}
      <Typography variant="caption" color="text.secondary" mt={3}>
        Don't have an account?{' '}
        <Button
          onClick={() => navigate('/register')}
          sx={{ textTransform: 'none', p: 0 }}
        >
          Register here
        </Button>
      </Typography>

      {/* ✅ Success Toast */}
      <Snackbar
        open={success}
        autoHideDuration={1000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Login successful! Redirecting...
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login;
