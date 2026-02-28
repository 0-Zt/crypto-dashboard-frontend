import React from 'react';
import { Box, Typography } from '@mui/material';
import { Card } from './ui/card';

const ProfilePlaceholder = () => {
  return (
    <Box sx={{ minHeight: '100vh', pt: 3, pb: 3, pl: { xs: 2, md: 33 }, pr: 2 }}>
      <Card className="p-6">
        <Typography variant="h5" sx={{ color: 'text.primary', mb: 1 }}>
          Perfil
        </Typography>
        <Typography sx={{ color: 'text.secondary' }}>
          Esta sección estará disponible próximamente.
        </Typography>
      </Card>
    </Box>
  );
};

export default ProfilePlaceholder;
