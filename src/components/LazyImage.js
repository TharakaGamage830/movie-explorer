import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';

const LazyImage = ({
  src,
  alt,
  aspectRatio = '2 / 3',
  borderRadius = 8,
  sx = {},
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <Box
        sx={{
          width: '100%',
          aspectRatio,
          borderRadius: `${borderRadius}px`,
          backgroundColor: 'custom.raisedSurface',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...sx,
        }}
        aria-label={alt}
      >
        <Typography variant="caption" color="text.secondary" sx={{ px: 1, textAlign: 'center' }}>
          {alt || 'Image not available'}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        aspectRatio,
        borderRadius: `${borderRadius}px`,
        overflow: 'hidden',
        ...sx,
      }}
    >
      {!loaded && (
        <Skeleton
          variant="rounded"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: `${borderRadius}px`,
          }}
        />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        style={{
          display: loaded ? 'block' : 'none',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: `${borderRadius}px`,
        }}
      />
    </Box>
  );
};

export default LazyImage;
