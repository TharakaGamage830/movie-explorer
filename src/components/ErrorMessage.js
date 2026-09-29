import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const ErrorMessage = ({ message, onRetry }) => (
  <Box
    role="alert"
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      py: 6,
      px: 2,
      textAlign: 'center',
    }}
  >
    <Typography
      variant="body1"
      sx={{ color: 'primary.main', mb: 2, fontWeight: 500 }}
    >
      {message}
    </Typography>
    {onRetry && (
      <Button variant="contained" color="primary" onClick={onRetry}>
        Retry
      </Button>
    )}
  </Box>
);

export default ErrorMessage;
