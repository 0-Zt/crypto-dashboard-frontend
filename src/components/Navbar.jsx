import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Menu, MenuItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { HelpCircle, Settings, Menu as MenuIcon, LogOut, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import InfoDialog from './InfoDialog';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [infoOpen, setInfoOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleInfoClick = () => {
    setInfoOpen(true);
  };

  const handleInfoClose = () => {
    setInfoOpen(false);
  };

  const handleSettingsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      handleMenuClose();
      await logout();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <>
      <AppBar 
        position="fixed" 
        sx={{ 
          background: '#000',
          borderBottom: '1px solid #333333',
          boxShadow: 'none'
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            sx={{
              marginRight: 2,
              color: 'rgb(156, 163, 175)',
              '&:hover': {
                backgroundColor: 'rgba(75, 85, 99, 0.1)',
                color: 'rgb(209, 213, 219)'
              }
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1,
              color: '#fff',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            Crypto Analytics
          </Typography>
          <IconButton 
            color="inherit" 
            onClick={handleInfoClick}
            sx={{ 
              marginRight: 1,
              color: 'rgb(156, 163, 175)',
              '&:hover': {
                backgroundColor: 'rgba(75, 85, 99, 0.1)',
                color: 'rgb(209, 213, 219)'
              }
            }}
          >
            <HelpCircle />
          </IconButton>
          <IconButton 
            onClick={handleSettingsClick}
            sx={{ 
              color: 'rgb(156, 163, 175)',
              '&:hover': {
                backgroundColor: 'rgba(75, 85, 99, 0.1)',
                color: 'rgb(209, 213, 219)'
              }
            }}
          >
            <Settings />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Menú de usuario */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        PaperProps={{
          sx: {
            backgroundColor: '#000000',
            border: '1px solid #333333',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
            mt: 1.5,
            '& .MuiMenuItem-root': {
              px: 2,
              py: 1,
              borderRadius: 1,
              color: 'rgb(209, 213, 219)',
              '&:hover': {
                backgroundColor: 'rgba(75, 85, 99, 0.1)',
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle1" sx={{ color: 'rgb(209, 213, 219)' }}>
            {user?.email}
          </Typography>
        </Box>
        <Divider sx={{ borderColor: 'rgba(75, 85, 99, 0.3)' }} />
        <MenuItem component={Link} to="/profile">
          <ListItemIcon>
            <User className="w-5 h-5 text-gray-400" />
          </ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </MenuItem>
        <Divider sx={{ my: 1, borderColor: 'rgba(75, 85, 99, 0.3)' }} />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogOut className="w-5 h-5 text-gray-400" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>

      {/* Sidebar */}
      <Box
        sx={{
          position: 'fixed',
          top: 64, // altura del AppBar
          left: sidebarOpen ? 0 : -240,
          width: 240,
          height: 'calc(100vh - 64px)',
          backgroundColor: '#000000',
          borderRight: '1px solid #333333',
          transition: 'left 0.3s ease-in-out',
          zIndex: 1200,
          padding: '1rem'
        }}
      >
        <div className="flex flex-col gap-2">
          <Link to="/dashboard" className="text-decoration-none">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800/50 transition-colors">
              <span>Dashboard</span>
            </div>
          </Link>
          <Link to="/portfolio" className="text-decoration-none">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800/50 transition-colors">
              <span>Portfolio</span>
            </div>
          </Link>
        </div>
      </Box>

      <InfoDialog open={infoOpen} onClose={handleInfoClose} />

      {/* Espaciador para el contenido debajo del AppBar */}
      <Toolbar />
    </>
  );
};

export default Navbar;
