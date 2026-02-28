import React from 'react';
import { signInWithPopup } from 'firebase/auth';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { Button } from '@mui/material';
import { Google } from '@mui/icons-material';

const auth = getAuth();
const googleProvider = new GoogleAuthProvider();

const SignIn = () => {
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      // Obtener el token de ID para enviarlo al backend
      const idToken = await user.getIdToken();
      localStorage.setItem('authToken', idToken);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  };

  return (
    <Button
      variant="contained"
      startIcon={<Google />}
      onClick={signInWithGoogle}
      sx={{
        backgroundColor: '#4285f4',
        color: 'white',
        '&:hover': {
          backgroundColor: '#357abd',
        },
      }}
    >
      Iniciar sesión con Google
    </Button>
  );
};

export default SignIn;
