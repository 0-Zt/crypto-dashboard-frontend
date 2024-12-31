import React from 'react';
import { Button } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import GoogleIcon from '@mui/icons-material/Google';

export default function Login() {
  const { signInWithGoogle } = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="max-w-md w-full space-y-8 p-8 bg-slate-800/50 rounded-xl backdrop-blur-sm">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-white">
            Bienvenido a Trading Dashboard
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Inicia sesión para acceder a tu portafolio
          </p>
        </div>
        <Button
          fullWidth
          variant="contained"
          onClick={handleGoogleSignIn}
          startIcon={<GoogleIcon />}
          sx={{
            mt: 3,
            backgroundColor: 'rgba(99, 102, 241, 0.8)',
            '&:hover': {
              backgroundColor: 'rgba(99, 102, 241, 0.9)',
            },
          }}
        >
          Continuar con Google
        </Button>
      </div>
    </div>
  );
}
