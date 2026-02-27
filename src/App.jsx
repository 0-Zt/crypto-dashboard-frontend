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
      paper: 'rgba(13, 16, 28, 0.78)',
    },
    primary: {
      main: '#35e8ff',
    },
    secondary: {
      main: '#8b7bff',
    },
    success: {
      main: '#00d68f',
    },
    error: {
      main: '#ff5f7c',
    },
    warning: {
      main: '#ffba5a',
    },
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: ['Inter', 'SF Pro Display', 'system-ui', '-apple-system', 'sans-serif'].join(','),
    h6: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
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
            'radial-gradient(circle at 10% 10%, rgba(53, 232, 255, 0.12), transparent 45%), radial-gradient(circle at 90% 90%, rgba(139, 123, 255, 0.14), transparent 42%), #05070d',
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
