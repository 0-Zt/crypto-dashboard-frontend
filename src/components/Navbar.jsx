import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  Avatar,
} from '@mui/material';
import {
  HelpCircle,
  Settings,
  Menu as MenuIcon,
  LogOut,
  User,
  LayoutDashboard,
  BriefcaseBusiness,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import InfoDialog from './InfoDialog';

const navLinkSx = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '10px 14px',
  borderRadius: '12px',
  fontWeight: 500,
  color: '#a6b0cf',
  textDecoration: 'none',
  transition: 'all 0.2s ease',
};

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
      console.error('Error during logout:', error);
    }
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          background: 'rgba(6, 9, 17, 0.8)',
          borderBottom: '1px solid rgba(116, 138, 199, 0.2)',
          backdropFilter: 'blur(14px)',
          boxShadow: '0 20px 45px rgba(0, 0, 0, 0.35)',
        }}
      >
        <Toolbar sx={{ minHeight: '70px !important' }}>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            sx={{
              marginRight: 1.5,
              color: '#c4ccee',
              border: '1px solid rgba(98, 120, 177, 0.4)',
              backgroundColor: 'rgba(11, 16, 30, 0.8)',
              '&:hover': {
                backgroundColor: 'rgba(33, 46, 82, 0.8)',
              },
            }}
          >
            {sidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
          </IconButton>

          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 1.25 }}>
            <MenuIcon size={18} color="#36e2ff" />
            <Typography variant="h6" component="div" sx={{ color: '#eff2ff' }}>
              Crypto Analytics
            </Typography>
            <Chip
              size="small"
              label="Live"
              sx={{
                height: 22,
                fontWeight: 600,
                color: '#0a1020',
                background: 'linear-gradient(135deg, #35e8ff 0%, #7de3ff 100%)',
              }}
            />
          </Box>

          <IconButton
            color="inherit"
            onClick={handleInfoClick}
            sx={{
              marginRight: 1,
              color: '#b4bfdc',
              '&:hover': {
                backgroundColor: 'rgba(75, 104, 181, 0.18)',
                color: '#dce4ff',
              },
            }}
          >
            <HelpCircle size={20} />
          </IconButton>
          <IconButton
            onClick={handleSettingsClick}
            sx={{
              color: '#b4bfdc',
              border: '1px solid rgba(98, 120, 177, 0.35)',
              backgroundColor: 'rgba(11, 16, 30, 0.8)',
              '&:hover': {
                backgroundColor: 'rgba(75, 104, 181, 0.18)',
                color: '#dce4ff',
              },
            }}
          >
            <Settings size={18} />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        PaperProps={{
          sx: {
            minWidth: 240,
            backgroundColor: 'rgba(11, 16, 30, 0.92)',
            border: '1px solid rgba(98, 120, 177, 0.32)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 18px 30px rgba(0, 0, 0, 0.45)',
            mt: 1.5,
            borderRadius: 2,
            '& .MuiMenuItem-root': {
              mx: 1,
              px: 1.5,
              py: 1,
              borderRadius: 1.5,
              color: '#d7def5',
              '&:hover': {
                backgroundColor: 'rgba(53, 80, 145, 0.22)',
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1.6, display: 'flex', alignItems: 'center', gap: 1.2 }}>
          <Avatar sx={{ width: 30, height: 30, fontSize: 13, bgcolor: 'rgba(53, 232, 255, 0.2)', color: '#7ee4ff' }}>
            {user?.email?.charAt(0)?.toUpperCase() || 'U'}
          </Avatar>
          <Typography variant="subtitle2" sx={{ color: '#e2e9ff' }}>
            {user?.email}
          </Typography>
        </Box>
        <Divider sx={{ borderColor: 'rgba(116, 138, 199, 0.24)' }} />
        <MenuItem component={NavLink} to="/portfolio">
          <ListItemIcon>
            <User className="w-5 h-5 text-slate-300" />
          </ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </MenuItem>
        <Divider sx={{ my: 1, borderColor: 'rgba(116, 138, 199, 0.24)' }} />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogOut className="w-5 h-5 text-slate-300" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>

      <Box
        sx={{
          position: 'fixed',
          top: 70,
          left: sidebarOpen ? 0 : -250,
          width: 250,
          height: 'calc(100vh - 70px)',
          background: 'linear-gradient(180deg, rgba(8, 12, 22, 0.93) 0%, rgba(7, 10, 17, 0.93) 100%)',
          borderRight: '1px solid rgba(116, 138, 199, 0.2)',
          backdropFilter: 'blur(14px)',
          transition: 'left 0.28s ease-in-out',
          zIndex: 1200,
          padding: '1rem 0.75rem',
          overflowY: 'auto',
        }}
      >
        <div className="flex flex-col gap-1.5">
          <NavLink
            to="/dashboard"
            style={({ isActive }) => ({
              ...navLinkSx,
              color: isActive ? '#ebf1ff' : navLinkSx.color,
              background: isActive ? 'linear-gradient(130deg, rgba(53, 232, 255, 0.22), rgba(139, 123, 255, 0.22))' : 'transparent',
              border: isActive ? '1px solid rgba(126, 160, 255, 0.5)' : '1px solid transparent',
            })}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/portfolio"
            style={({ isActive }) => ({
              ...navLinkSx,
              color: isActive ? '#ebf1ff' : navLinkSx.color,
              background: isActive ? 'linear-gradient(130deg, rgba(53, 232, 255, 0.22), rgba(139, 123, 255, 0.22))' : 'transparent',
              border: isActive ? '1px solid rgba(126, 160, 255, 0.5)' : '1px solid transparent',
            })}
          >
            <BriefcaseBusiness size={18} />
            <span>Portfolio</span>
          </NavLink>
        </div>
      </Box>

      <InfoDialog open={infoOpen} onClose={handleInfoClose} />

      <Toolbar sx={{ minHeight: '70px !important' }} />
    </>
  );
};

export default Navbar;
