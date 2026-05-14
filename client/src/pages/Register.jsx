// Register.jsx
import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Stack, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
import http from '../api/http';
import Navbar from '../components/Navbar';
const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await http.post('/api/auth/register', formData);

     
      localStorage.setItem('username', res.data.username);

      setSuccess(true);

      
      setTimeout(() => {
        navigate('/chat', { state: { username: res.data.username } });
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <>
    <Navbar/>
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
      <Box textAlign="center" mb={4}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Register
        </Typography>
      </Box>
      <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: 400 }}>
        <Stack spacing={2}>
          <TextField
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            required
          />
          {error && <Typography color="error">{error}</Typography>}
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Register
          </Button>
        </Stack>
      </Box>

      <Snackbar
        open={success}
        autoHideDuration={1000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Registration successful! Redirecting...
        </Alert>
      </Snackbar>
    </Box>
    </>
  );
};

export default Register;
