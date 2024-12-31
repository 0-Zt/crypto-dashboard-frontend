import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {
  MenuIcon,
  Search,
  Bell,
  Settings,
  HelpCircle,
  LineChart,
  LayoutDashboard,
  LogOut,
  User,
} from 'lucide-react';
import { 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText, 
  Divider,
  Avatar,
  IconButton,
  Box,
  Typography,
} from '@mui/material';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import Portfolio from './components/Portfolio';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AccountBalanceWallet } from '@mui/icons-material';
import Login from './components/Login';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#000000',
      paper: 'transparent',
    },
    primary: {
      main: '#00f2ea',
    },
    secondary: {
      main: '#00ff88',
    },
    error: {
      main: '#ff3358',
    },
    warning: {
      main: '#ffbb00',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#000000',
          margin: 0,
          padding: 0,
          boxSizing: 'border-box',
          overflowX: 'hidden'
        }
      }
    }
  }
});

const MainApp = () => {
  const { user } = useAuth();
  console.log("Current user:", user); // Para debugging

  if (!user) {
    return <Login />;
  }

  return <AuthenticatedApp />;
};

const AuthenticatedApp = () => {
  const { logout, user } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  console.log("Authenticated user:", user); // Para debugging

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      handleClose();
      await logout();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      width: '100vw',
      backgroundColor: 'black',
      margin: 0,
      padding: 0,
      boxSizing: 'border-box',
      overflowX: 'hidden'
    }}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/portfolio" element={<Portfolio />} />
      </Routes>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          sx: {
            backgroundColor: '#1a1a1a',
            border: '1px solid #333',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            mt: 1.5,
            '& .MuiMenuItem-root': {
              px: 2,
              py: 1,
              borderRadius: 1,
              '&:hover': {
                backgroundColor: '#2a2a2a',
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle1" noWrap>
            {user?.email}
          </Typography>
        </Box>
        <Divider sx={{ borderColor: '#333' }} />
        <MenuItem component={Link} to="/profile">
          <ListItemIcon>
            <User className="w-5 h-5" />
          </ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </MenuItem>
        <MenuItem component={Link} to="/settings">
          <ListItemIcon>
            <Settings className="w-5 h-5" />
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </MenuItem>
        <Divider sx={{ my: 1, borderColor: '#333' }} />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogOut className="w-5 h-5" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
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
