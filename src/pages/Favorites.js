
import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MovieCard from '../components/MovieCard';
import EmptyState from '../components/EmptyState';
import { useMovieContext } from '../context/MovieContext';
import { EMPTY_STATE_MESSAGES } from '../utils/constants';

const Favorites = () => {
  const { favorites } = useMovieContext();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }} component="main">
      <Typography variant="h3" component="h1" sx={{ mb: 3, fontWeight: 700 }}>
        My Favorites
      </Typography>

      {favorites.length === 0 ? (
        <EmptyState message={EMPTY_STATE_MESSAGES.noFavorites} />
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(4, 1fr)',
              md: 'repeat(6, 1fr)',
            },
            gap: '16px',
          }}
        >
          {favorites.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </Box>
      )}
    </Container>
  );
};

export default Favorites;
