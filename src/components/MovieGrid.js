import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MovieCard from './MovieCard';
import SkeletonCard from './SkeletonCard';
import EmptyState from './EmptyState';
import ErrorMessage from './ErrorMessage';
import { INFINITE_SCROLL, SKELETON_COUNT, EMPTY_STATE_MESSAGES } from '../utils/constants';

const MovieGrid = ({
  movies,
  loading,
  loadingMore,
  error,
  hasMore,
  onLoadMore,
  onRetry,
  sentinelRef,
}) => {
  if (loading && movies.length === 0) {
    return (
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, 1fr)',
            sm: 'repeat(4, 1fr)',
            md: 'repeat(5, 1fr)',
          },
          gap: '16px',
        }}
      >
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </Box>
    );
  }

  if (error && movies.length === 0) {
    return <ErrorMessage message={error} onRetry={onRetry} />;
  }

  if (!loading && movies.length === 0) {
    return <EmptyState message={EMPTY_STATE_MESSAGES.noResults} />;
  }

  return (
    <>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, 1fr)',
            sm: 'repeat(4, 1fr)',
            md: 'repeat(5, 1fr)',
          },
          gap: '16px',
        }}
      >
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}

        {loadingMore &&
          Array.from({ length: 5 }).map((_, i) => (
            <SkeletonCard key={`skeleton-more-${i}`} />
          ))}
      </Box>

      {error && movies.length > 0 && (
        <ErrorMessage message={error} onRetry={onRetry} />
      )}

      {!hasMore && movies.length > 0 && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: 'center', py: 4 }}
        >
          {EMPTY_STATE_MESSAGES.endOfResults}
        </Typography>
      )}

      {hasMore && !loadingMore && !error && (
        INFINITE_SCROLL ? (
          <Box
            ref={sentinelRef}
            sx={{ height: 1, width: '100%' }}
            aria-hidden="true"
          />
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={onLoadMore}
              sx={{
                px: 5,
                py: 1.2,
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.9rem',
                textTransform: 'none',
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                  backgroundColor: 'primary.main',
                  color: '#fff',
                },
              }}
            >
              Load More Movies
            </Button>
          </Box>
        )
      )}
    </>
  );
};

export default MovieGrid;
