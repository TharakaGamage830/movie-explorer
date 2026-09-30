import React from 'react';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

const SkeletonCard = () => (
  <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
    <Skeleton
      variant="rounded"
      sx={{
        width: '100%',
        aspectRatio: '2 / 3',
        borderRadius: '8px',
      }}
    />
    <Skeleton
      variant="text"
      sx={{ mt: 1, width: '80%', height: 20 }}
    />
    <Skeleton
      variant="text"
      sx={{ width: '40%', height: 16, mt: 0.25 }}
    />
  </Box>
);

export default SkeletonCard;
