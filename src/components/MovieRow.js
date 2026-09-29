import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MovieCard from './MovieCard';
import SkeletonCard from './SkeletonCard';

const MovieRow = ({ title, movies, loading }) => (
  <Box sx={{ mb: 4 }}>
    <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
      {title}
    </Typography>
    <Box
      sx={{
        display: 'flex',
        gap: '16px',
        overflowX: 'auto',
        pb: 2,
        scrollbarWidth: 'thin',
        '&::-webkit-scrollbar': {
          height: 6,
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(255,255,255,0.15)',
          borderRadius: 3,
        },
      }}
    >
      {loading
        ? Array.from({ length: 8 }).map((_, i) => (
            <Box key={i} sx={{ minWidth: 160, maxWidth: 160 }}>
              <SkeletonCard />
            </Box>
          ))
        : movies.map((movie) => (
            <Box key={movie.id} sx={{ minWidth: 160, maxWidth: 160 }}>
              <MovieCard movie={movie} />
            </Box>
          ))}
    </Box>
  </Box>
);

export default MovieRow;
