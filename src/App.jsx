import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import Portfolio from './components/Portfolio';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#05070d',
      paper: '#0f1629',
    },
    primary: {
      main: '#47d7ff',
    },
    secondary: {
      main: '#9b8cff',
    },
    success: {
      main: '#24d69a',
    },
    error: {
      main: '#ff6b87',
    },
    text: {
      primary: '#eef2ff',
      secondary: '#9fb0db',
    },
  },
  shape: {
    borderRadius: 14,
  },
  typography: {
    fontFamily: ['Inter', 'SF Pro Display', 'system-ui', '-apple-system', 'sans-serif'].join(','),
    h5: { fontWeight: 700, letterSpacing: '-0.015em' },
    h6: { fontWeight: 700, letterSpacing: '-0.015em' },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background:
            'radial-gradient(circle at 8% 12%, rgba(71, 215, 255, 0.12), transparent 42%), radial-gradient(circle at 92% 88%, rgba(155, 140, 255, 0.14), transparent 38%), #05070d',
          margin: 0,
          padding: 0,
          boxSizing: 'border-box',
          overflowX: 'hidden',
        },
        '*': {
          boxSizing: 'border-box',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          paddingInline: 16,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(14, 20, 38, 0.75)',
          '& fieldset': {
            borderColor: 'rgba(117, 139, 199, 0.42)',
          },
          '&:hover fieldset': {
            borderColor: 'rgba(71, 215, 255, 0.75)',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#47d7ff',
          },
        },
      },
    },
  },
});

const MainApp = () => {
  const { user } = useAuth();
  if (!user) return <Login />;
  return <AuthenticatedApp />;
};

const AuthenticatedApp = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100vw', overflowX: 'hidden' }}>
    <Navbar />
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/portfolio" element={<Portfolio />} />
    </Routes>
  </Box>
);

const App = () => (
  <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <AuthProvider>
      <Router>
        <MainApp />
      </Router>
    </AuthProvider>
  </ThemeProvider>
);

export default App;
