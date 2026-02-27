import React from 'react';
import { Button, Chip } from '@mui/material';
import { ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import GoogleIcon from '@mui/icons-material/Google';

export default function Login() {
  const { signInWithGoogle } = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full rounded-3xl border border-[#30406b] bg-[linear-gradient(150deg,rgba(16,25,45,.95)_0%,rgba(8,12,22,.92)_100%)] shadow-[0_28px_70px_rgba(0,0,0,.45)] p-8">
        <div className="flex items-center justify-between mb-6">
          <Chip
            icon={<Sparkles size={14} />}
            label="Crypto Dashboard"
            sx={{ backgroundColor: 'rgba(71, 215, 255, 0.16)', color: '#9beaff', border: '1px solid rgba(71, 215, 255, 0.3)' }}
          />
          <ShieldCheck size={18} className="text-[#9b8cff]" />
        </div>

        <div className="text-left">
          <h2 className="text-3xl font-bold text-[#eef2ff]">Bienvenido de nuevo</h2>
          <p className="mt-2 text-sm text-[#9fb0db]">Inicia sesión para acceder a tu análisis de mercado y portafolio.</p>
        </div>

        <Button
          fullWidth
          variant="contained"
          onClick={handleGoogleSignIn}
          startIcon={<GoogleIcon />}
          sx={{
            mt: 4,
            py: 1.2,
            background: 'linear-gradient(135deg, #47d7ff 0%, #9b8cff 100%)',
            color: '#0a1020',
            fontWeight: 700,
            '&:hover': {
              background: 'linear-gradient(135deg, #5de0ff 0%, #a99cff 100%)',
            },
          }}
        >
          Continuar con Google
        </Button>
      </div>
    </div>
  );
}
