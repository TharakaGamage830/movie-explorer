import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const EmptyState = ({ message }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      py: 8,
      px: 2,
      textAlign: 'center',
    }}
  >
    <Typography variant="body1" color="text.secondary">
      {message}
    </Typography>
  </Box>
);

export default EmptyState;
