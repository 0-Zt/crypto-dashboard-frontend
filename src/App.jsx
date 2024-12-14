import React, { useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline, useMediaQuery } from '@mui/material';
import { BrowserRouter as Router } from 'react-router-dom';
import { Box, Toolbar, Typography, IconButton, AppBar, Drawer } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import InfoIcon from '@mui/icons-material/Info';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Dashboard from './components/Dashboard';
import InfoDialog from './components/InfoDialog';

const drawerWidth = 240;

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#1976d2' },
    secondary: { main: '#f50057' },
    background: {
      default: '#0a1929', 
      paper: '#132f4c',
    },
    text: { primary: '#ffffff' }
  },
  typography: { fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' },
});

function App() {
  const [infoOpen, setInfoOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', flexDirection: 'column' }}>
          <AppBar position="static">
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton color="inherit" onClick={() => setDrawerOpen(!drawerOpen)}>
                  <MenuIcon />
                </IconButton>
                <Typography variant="h6" component="div">
                🚀 Crypto Dashboard Relax
                </Typography>
              </Box>
              <Box>
                <IconButton color="inherit" onClick={() => setInfoOpen(true)}>
                  <InfoIcon />
                </IconButton>
              </Box>
            </Toolbar>
          </AppBar>

          <Drawer
            variant={isMobile ? "temporary" : "persistent"}
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', backgroundColor: '#10243E' },
            }}
          >
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6" noWrap component="div">
                Crypto Dashboard
              </Typography>
              <IconButton onClick={() => setDrawerOpen(false)} color="inherit">
                <ChevronLeftIcon />
              </IconButton>
            </Toolbar>
            <Box sx={{ overflow: 'auto', p: 2 }}>
              <Typography variant="body2">Navegación futura aquí</Typography>
              {/* Aquí puedes agregar elementos del menú o links */}
            </Box>
          </Drawer>

          <InfoDialog open={infoOpen} onClose={() => setInfoOpen(false)} />

          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 2,
              overflowY: 'auto', // Habilitar scroll vertical
              transition: (theme) => theme.transitions.create('margin', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
              ...( !isMobile && drawerOpen && {
                marginLeft: `${drawerWidth}px`,
                transition: (theme) => theme.transitions.create('margin', {
                  easing: theme.transitions.easing.easeOut,
                  duration: theme.transitions.duration.enteringScreen,
                }),
              })
            }}
          >
            <Dashboard />
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
