import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, alpha } from '@mui/material/styles';
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
    primary: {
      main: '#5CC8FF',
      light: '#9BE4FF',
      dark: '#1A8FD1',
    },
    secondary: {
      main: '#8A7DFF',
      light: '#B8AEFF',
      dark: '#5A4FCC',
    },
    success: {
      main: '#24D69A',
    },
    error: {
      main: '#FF6B87',
    },
    warning: {
      main: '#FFC46B',
    },
    text: {
      primary: '#EEF2FF',
      secondary: '#9FB0DB',
    },
    background: {
      default: '#060A14',
      paper: '#101828',
    },
    divider: 'rgba(132, 151, 204, 0.22)',
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
            'radial-gradient(circle at 12% 10%, rgba(92, 200, 255, 0.12), transparent 42%), radial-gradient(circle at 88% 88%, rgba(138, 125, 255, 0.14), transparent 40%), #060a14',
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
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid rgba(132, 151, 204, 0.22)',
          background: 'linear-gradient(150deg, rgba(18,28,48,0.94) 0%, rgba(10,14,24,0.94) 100%)',
          boxShadow: '0 16px 40px rgba(0,0,0,0.35)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          borderRadius: 12,
          boxShadow: '0 10px 22px rgba(20, 32, 56, 0.45)',
          background: 'linear-gradient(135deg, #5cc8ff 0%, #8a7dff 100%)',
          color: '#08101f',
          '&:hover': {
            boxShadow: '0 14px 24px rgba(20, 32, 56, 0.55)',
            background: 'linear-gradient(135deg, #6fd0ff 0%, #988dff 100%)',
          },
        },
        outlined: {
          borderColor: 'rgba(132, 151, 204, 0.45)',
          '&:hover': {
            borderColor: '#5CC8FF',
            backgroundColor: alpha('#5CC8FF', 0.08),
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(11, 17, 31, 0.55)',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(132, 151, 204, 0.36)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(92, 200, 255, 0.72)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#5CC8FF',
          },
        },
      },
    },
  },
});

const MainApp = () => {
  const { user } = useAuth();

  if (!user) {
    return <Login />;
  }

  return <AuthenticatedApp />;
};

const AuthenticatedApp = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100vw',
        margin: 0,
        padding: 0,
        overflowX: 'hidden',
      }}
    >
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/portfolio" element={<Portfolio />} />
      </Routes>
    </Box>
  );
};

const App = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <MainApp />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
