import React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import LazyImage from './LazyImage';
import { useAuth } from '../context/AuthContext';
import { useMovieContext } from '../context/MovieContext';
import { useToast } from '../context/ToastContext';
import { getImageUrl, getYear, formatRating } from '../utils/helpers';

const MovieCard = React.memo(({ movie }) => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { isFavorite, addFavorite, removeFavorite } = useMovieContext();
  const { showToast } = useToast();
  const favorite = isFavorite(movie.id);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      showToast('Please sign in to add favorites.', 'warning');
      navigate('/login');
      return;
    }
    if (favorite) {
      removeFavorite(movie.id);
      showToast(`Removed "${movie.title}" from favorites.`, 'info');
    } else {
      addFavorite(movie);
      showToast(`Added "${movie.title}" to favorites!`, 'success');
    }
  };

  const handleCardClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <Box
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${movie.title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'transform 200ms ease',
        '&:hover': {
          transform: 'scale(1.04)',
          '& .movie-card-poster': {
            borderColor: 'primary.main',
            boxShadow: '0 4px 18px rgba(229, 9, 20, 0.45)',
          },
        },
      }}
    >
      {/* Poster container with strictly enforced 2:3 ratio */}
      <Box
        className="movie-card-poster"
        sx={{
          position: 'relative',
          width: '100%',
          aspectRatio: '2 / 3',
          borderRadius: '8px',
          overflow: 'hidden',
          backgroundColor: 'custom.raisedSurface',
          border: '2px solid transparent',
          transition: 'border-color 200ms ease, box-shadow 200ms ease',
          boxSizing: 'border-box',
        }}
      >
        <LazyImage
          src={getImageUrl(movie.poster_path, 'card')}
          alt={`${movie.title} poster`}
          aspectRatio="2 / 3"
          borderRadius={8}
          sx={{ width: '100%', height: '100%' }}
        />

        <Box
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            borderRadius: '4px',
            px: 0.75,
            py: 0.25,
            zIndex: 1,
          }}
        >
          <StarOutlinedIcon sx={{ fontSize: 14, color: 'secondary.main' }} />
          <Typography variant="caption" sx={{ color: '#FFFFFF', fontWeight: 600, lineHeight: 1 }}>
            {formatRating(movie.vote_average)}
          </Typography>
        </Box>

        <IconButton
          onClick={handleFavoriteClick}
          aria-label={favorite ? `Remove ${movie.title} from favorites` : `Add ${movie.title} to favorites`}
          size="small"
          sx={{
            position: 'absolute',
            top: 4,
            right: 4,
            color: favorite ? 'primary.main' : 'rgba(255,255,255,0.7)',
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            zIndex: 1,
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.65)',
            },
          }}
        >
          {favorite ? (
            <FavoriteIcon sx={{ fontSize: 18 }} />
          ) : (
            <FavoriteBorderOutlinedIcon sx={{ fontSize: 18 }} />
          )}
        </IconButton>
      </Box>

      {/* Uniform title and release year */}
      <Typography
        variant="body2"
        sx={{
          mt: 1,
          fontWeight: 600,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 1,
          WebkitBoxOrient: 'vertical',
          lineHeight: 1.35,
          minHeight: '1.35em',
        }}
      >
        {movie.title}
      </Typography>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: 'block', minHeight: '1.4em', mt: 0.25 }}
      >
        {getYear(movie.release_date)}
      </Typography>
    </Box>
  );
});

MovieCard.displayName = 'MovieCard';

export default MovieCard;
