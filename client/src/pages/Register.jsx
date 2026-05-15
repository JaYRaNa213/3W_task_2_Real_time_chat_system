import React, { useState, useContext } from 'react';
import { Box, Typography, TextField, Button, Snackbar, Alert, Container, CircularProgress } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, ArrowRight } from 'lucide-react';
import http from '../api/http';
import { AuthContext } from '../context/AuthContext';

const MotionBox = motion.create(Box);

const Register = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await http.post('/api/auth/register', formData);
      setUser({
        username: res.data.username,
        token: res.data.token,
        guest: false,
      });

      setSuccess(true);
      setTimeout(() => navigate('/chat'), 1000);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Username may be taken.');
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: 'background.default', position: 'relative' }}>
      <Box sx={{ position: 'fixed', top: '-10%', left: '-10%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(0,229,255,0.1) 0%, transparent 70%)', filter: 'blur(80px)', zIndex: 0 }} />
      <Box sx={{ position: 'fixed', bottom: '-10%', right: '-10%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(126,87,194,0.15) 0%, transparent 70%)', filter: 'blur(80px)', zIndex: 0 }} />

      <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', zIndex: 10 }}>
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          sx={{
            p: { xs: 4, md: 6 },
            borderRadius: 4,
            bgcolor: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4, cursor: 'pointer' }} onClick={() => navigate('/')}>
            <Box sx={{ width: 32, height: 32, borderRadius: '10px', background: 'linear-gradient(135deg, #7E57C2 0%, #00E5FF 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageSquare size={18} color="#fff" />
            </Box>
            <Typography variant="h6" fontWeight="800">RT Chat</Typography>
          </Box>

          <Typography variant="h3" fontWeight="800" sx={{ mb: 1 }}>Create an account</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>Join the next generation of real-time messaging.</Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              sx={{ mb: 3 }}
            />
            <TextField
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              sx={{ mb: 3 }}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              sx={{ mb: 4 }}
            />

            {error && (
              <Alert severity="error" sx={{ mb: 3, bgcolor: 'rgba(211, 47, 47, 0.1)', color: '#ff8a80', border: '1px solid rgba(211, 47, 47, 0.3)' }}>
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ArrowRight size={20} />}
              sx={{ py: 1.5, fontSize: '1.1rem' }}
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </Button>
          </Box>

          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 4 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#B085F5', textDecoration: 'none', fontWeight: 600 }}>
              Sign in instead
            </Link>
          </Typography>
        </MotionBox>
      </Container>

      <Snackbar open={success} autoHideDuration={1500} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" sx={{ bgcolor: 'rgba(56, 142, 60, 0.9)', color: '#fff' }}>
          Account created! Redirecting...
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Register;
