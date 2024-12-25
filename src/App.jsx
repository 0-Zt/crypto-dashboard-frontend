import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { 
  LayoutDashboard, 
  LineChart, 
  Settings, 
  Bell,
  Search,
  Menu as MenuIcon,
  HelpCircle
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import InfoDialog from './components/InfoDialog';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0B1120',
      paper: 'rgba(17, 24, 39, 0.7)',
    },
  },
});

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-[#0B1120] via-[#1E1B4B] to-[#0B1120]">
          {/* Navbar */}
          <nav className="fixed top-0 z-50 w-full border-b border-slate-800/20 bg-slate-900/80 backdrop-blur-xl">
            <div className="px-4 mx-auto">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                  <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg transition-colors"
                  >
                    <MenuIcon className="h-5 w-5" />
                  </button>
                  <div className="flex items-center ml-4">
                    <LineChart className="h-6 w-6 text-indigo-500" />
                    <span className="ml-2 text-lg font-semibold bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">
                      Crypto Analytics
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="relative hidden md:block">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <Search className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      className="w-64 pl-10 pr-4 py-1.5 text-sm text-slate-200 bg-slate-800/50 border border-slate-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50"
                      placeholder="Search markets..."
                    />
                  </div>
                  
                  <button
                    onClick={() => setInfoDialogOpen(true)}
                    className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg transition-colors"
                    title="Información de Indicadores"
                  >
                    <HelpCircle className="h-5 w-5" />
                  </button>
                  
                  <button className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg transition-colors relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-indigo-500 rounded-full"></span>
                  </button>
                  
                  <button className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg transition-colors">
                    <Settings className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </nav>

          {/* Sidebar */}
          <aside className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} bg-slate-900/80 border-r border-slate-800/20 backdrop-blur-xl`}>
            <div className="h-full px-4 py-4 overflow-y-auto">
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => {/* Implementar navegación al dashboard */}}
                    className="flex w-full items-center p-3 text-slate-200 rounded-lg hover:bg-slate-800/50 group transition-colors"
                  >
                    <LayoutDashboard className="h-5 w-5 text-indigo-500" />
                    <span className="ml-3 font-medium">Dashboard</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {/* Implementar navegación a mercados */}}
                    className="flex w-full items-center p-3 text-slate-400 rounded-lg hover:bg-slate-800/50 group transition-colors"
                  >
                    <LineChart className="h-5 w-5" />
                    <span className="ml-3">Markets</span>
                  </button>
                </li>
              </ul>
            </div>
          </aside>

          {/* Main content */}
          <main className={`pt-20 transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : ''}`}>
            <div className="p-4">
              <Dashboard />
            </div>
          </main>

          {/* Info Dialog */}
          <InfoDialog open={infoDialogOpen} onClose={() => setInfoDialogOpen(false)} />
        </div>
        <footer className="fixed bottom-0 w-full py-2 text-center text-sm text-slate-400 bg-slate-900/50 backdrop-blur-sm border-t border-slate-800/50">
          Made with 💜 by 0-Zxt
        </footer>
      </Router>
    </ThemeProvider>
  );
}

export default App;