import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Drawer,
  Tooltip,
  Divider,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from '@mui/material';
import {
  HelpCircle,
  Settings,
  Menu as MenuIcon,
  LogOut,
  LayoutDashboard,
  BriefcaseBusiness,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import InfoDialog from './InfoDialog';

const RAIL_WIDTH = 72;
const MOBILE_DRAWER_WIDTH = 260;

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/portfolio', label: 'Portfolio', icon: BriefcaseBusiness },
];

const railButtonSx = {
  width: 44,
  height: 44,
  borderRadius: '14px',
  color: '#aebbe3',
  border: '1px solid rgba(116, 138, 199, 0.18)',
  background: 'rgba(10, 16, 31, 0.65)',
  '&:hover': {
    background: 'rgba(43, 61, 110, 0.35)',
    color: '#eaf0ff',
  },
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const [infoOpen, setInfoOpen] = useState(false);
  const [settingsAnchorEl, setSettingsAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const settingsOpen = Boolean(settingsAnchorEl);

  const handleLogout = async () => {
    try {
      setSettingsAnchorEl(null);
      await logout();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const MobileMenu = (
    <Box sx={{ width: MOBILE_DRAWER_WIDTH, p: 2 }}>
      <Typography sx={{ color: '#eaf0ff', fontWeight: 700, mb: 2 }}>Crypto Analytics</Typography>
      <Divider sx={{ borderColor: 'rgba(116, 138, 199, 0.24)', mb: 2 }} />
      <Box sx={{ display: 'grid', gap: 1 }}>
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setMobileOpen(false)}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '12px 14px',
              borderRadius: 12,
              textDecoration: 'none',
              color: isActive ? '#ecf3ff' : '#b2bddd',
              background: isActive ? 'linear-gradient(130deg, rgba(53,232,255,0.2), rgba(139,123,255,0.2))' : 'transparent',
              border: isActive ? '1px solid rgba(126, 160, 255, 0.5)' : '1px solid transparent',
            })}
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          background: 'rgba(6, 9, 17, 0.84)',
          borderBottom: '1px solid rgba(116, 138, 199, 0.2)',
          backdropFilter: 'blur(14px)',
          boxShadow: '0 20px 45px rgba(0, 0, 0, 0.35)',
          zIndex: (theme) => theme.zIndex.drawer + 2,
        }}
      >
        <Toolbar sx={{ minHeight: '70px !important', pl: { xs: 1, md: 2.2 } }}>
          <IconButton
            onClick={() => setMobileOpen(true)}
            sx={{ display: { xs: 'inline-flex', md: 'none' }, color: '#c4ccee', mr: 1 }}
          >
            <MenuIcon size={18} />
          </IconButton>

          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 1.25, pl: { md: `${RAIL_WIDTH}px` } }}>
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
            onClick={() => setInfoOpen(true)}
            sx={{
              marginRight: 1,
              color: '#b4bfdc',
              '&:hover': { backgroundColor: 'rgba(75, 104, 181, 0.18)', color: '#dce4ff' },
            }}
          >
            <HelpCircle size={20} />
          </IconButton>

          <IconButton
            onClick={(e) => setSettingsAnchorEl(e.currentTarget)}
            sx={{
              color: '#b4bfdc',
              border: '1px solid rgba(98, 120, 177, 0.35)',
              backgroundColor: 'rgba(11, 16, 30, 0.8)',
              '&:hover': { backgroundColor: 'rgba(75, 104, 181, 0.18)', color: '#dce4ff' },
            }}
          >
            <Settings size={18} />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          position: 'fixed',
          top: 70,
          left: 0,
          width: RAIL_WIDTH,
          height: 'calc(100vh - 70px)',
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
          p: 1,
          background: 'linear-gradient(180deg, rgba(8,12,22,0.93) 0%, rgba(7,10,17,0.93) 100%)',
          borderRight: '1px solid rgba(116, 138, 199, 0.2)',
          backdropFilter: 'blur(14px)',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        {navItems.map(({ to, label, icon: Icon }) => (
          <Tooltip key={to} title={label} placement="right">
            <NavLink to={to} style={{ textDecoration: 'none' }}>
              {({ isActive }) => (
                <IconButton
                  sx={{
                    ...railButtonSx,
                    color: isActive ? '#eaf2ff' : railButtonSx.color,
                    background: isActive
                      ? 'linear-gradient(130deg, rgba(53,232,255,0.22), rgba(139,123,255,0.22))'
                      : railButtonSx.background,
                    borderColor: isActive ? 'rgba(126, 160, 255, 0.5)' : 'rgba(116, 138, 199, 0.18)',
                  }}
                >
                  <Icon size={18} />
                </IconButton>
              )}
            </NavLink>
          </Tooltip>
        ))}
      </Box>

      <Drawer anchor="left" open={mobileOpen} onClose={() => setMobileOpen(false)} sx={{ display: { xs: 'block', md: 'none' } }}>
        {MobileMenu}
      </Drawer>

      <Menu
        anchorEl={settingsAnchorEl}
        open={settingsOpen}
        onClose={() => setSettingsAnchorEl(null)}
        PaperProps={{
          sx: {
            minWidth: 240,
            backgroundColor: 'rgba(11, 16, 30, 0.92)',
            border: '1px solid rgba(98, 120, 177, 0.32)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 18px 30px rgba(0, 0, 0, 0.45)',
            mt: 1.5,
            borderRadius: 2,
          },
        }}
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
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogOut className="w-5 h-5 text-slate-300" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>

      <InfoDialog open={infoOpen} onClose={() => setInfoOpen(false)} />
      <Toolbar sx={{ minHeight: '70px !important' }} />
    </>
  );
};

export default Navbar;
