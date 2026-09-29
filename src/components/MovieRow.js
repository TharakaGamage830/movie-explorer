import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MovieCard from './MovieCard';
import SkeletonCard from './SkeletonCard';

const MovieRow = ({ title, movies, loading, seeAllLink }) => (
  <Box sx={{ mb: 4 }}>
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: 2,
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: 600 }}>
        {title}
      </Typography>

      {seeAllLink && (
        <Link
          component={RouterLink}
          to={seeAllLink}
          sx={{
            color: 'primary.main',
            fontSize: '0.875rem',
            fontWeight: 600,
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            transition: 'opacity 150ms ease, transform 150ms ease',
            '&:hover': {
              opacity: 0.85,
              transform: 'translateX(2px)',
            },
          }}
        >
          See All
          <ArrowForwardIcon sx={{ fontSize: 16 }} />
        </Link>
      )}
    </Box>

    <Box
      sx={{
        display: 'flex',
        gap: '16px',
        overflowX: 'auto',
        pt: 1.5,
        pb: 2,
        px: 0.75,
        mx: -0.75,
        scrollbarWidth: 'thin',
        '&::-webkit-scrollbar': {
          height: 6,
        },
        '&::-webkit-scrollbar-track': {
          background: 'rgba(0, 0, 0, 0.05)',
          borderRadius: 3,
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(150, 150, 160, 0.3)',
          borderRadius: 3,
          transition: 'background-color 150ms ease',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: 'rgba(229, 9, 20, 0.7)',
        },
      }}
    >
      {loading
        ? Array.from({ length: 8 }).map((_, i) => (
            <Box key={i} sx={{ minWidth: 160, maxWidth: 160, flexShrink: 0 }}>
              <SkeletonCard />
            </Box>
          ))
        : movies.map((movie) => (
            <Box key={movie.id} sx={{ minWidth: 160, maxWidth: 160, flexShrink: 0 }}>
              <MovieCard movie={movie} />
            </Box>
          ))}

      {/* "See More" Card at the end of the slider - matches MovieCard total height */}
      {!loading && movies.length > 0 && seeAllLink && (
        <Box
          component={RouterLink}
          to={seeAllLink}
          sx={{
            minWidth: 160,
            maxWidth: 160,
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            textDecoration: 'none',
            color: 'text.primary',
            cursor: 'pointer',
            transition: 'transform 200ms ease',
            '&:hover': {
              transform: 'scale(1.04)',
              '& .see-all-poster': {
                borderColor: 'primary.main',
                boxShadow: '0 4px 18px rgba(229, 9, 20, 0.45)',
              },
              color: 'primary.main',
            },
          }}
        >
          {/* Poster-sized area (matches MovieCard poster) */}
          <Box
            className="see-all-poster"
            sx={{
              width: '100%',
              aspectRatio: '2 / 3',
              borderRadius: '8px',
              backgroundColor: 'custom.raisedSurface',
              border: '2px solid',
              borderColor: 'custom.border',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1.5,
              transition: 'border-color 200ms ease, box-shadow 200ms ease',
            }}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                backgroundColor: 'background.paper',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid',
                borderColor: 'custom.border',
              }}
            >
              <ArrowForwardIcon sx={{ fontSize: 20, color: 'inherit' }} />
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'inherit' }}>
              See All
            </Typography>
          </Box>
          {/* Spacer matching MovieCard title + year area */}
          <Box sx={{ mt: 1, minHeight: '1.35em' }} />
          <Box sx={{ mt: 0.25, minHeight: '1.4em' }} />
        </Box>
      )}
    </Box>
  </Box>
);

export default MovieRow;
