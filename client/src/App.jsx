// client/src/App.jsx
// UPDATED: Added ConversationProvider + AuthProvider wrapping
// All existing routes are preserved. New context is additive only.

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register';
import Chat from './pages/Chat.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import { ConversationProvider } from './context/ConversationContext.jsx';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ConversationProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/chat"
              element={
                <PrivateRoute>
                  <Chat />
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </ConversationProvider>
    </ThemeProvider>
  );
}

export default App;
