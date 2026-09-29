import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const Footer = () => (
  <Box
    component="footer"
    sx={{
      py: 3,
      px: 2,
      mt: 'auto',
      textAlign: 'center',
      borderTop: '1px solid',
      borderColor: 'custom.border',
    }}
  >
    <Typography variant="caption" color="text.secondary">
      This product uses the TMDb API but is not endorsed or certified by TMDb.
    </Typography>
  </Box>
);

export default Footer;
