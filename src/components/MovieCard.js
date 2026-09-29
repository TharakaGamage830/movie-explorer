import React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import LazyImage from './LazyImage';
import { useMovieContext } from '../context/MovieContext';
import { getImageUrl, getYear, formatRating } from '../utils/helpers';

const MovieCard = React.memo(({ movie }) => {
  const navigate = useNavigate();
  const { isFavorite, addFavorite, removeFavorite } = useMovieContext();
  const favorite = isFavorite(movie.id);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (favorite) {
      removeFavorite(movie.id);
    } else {
      addFavorite(movie);
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
        cursor: 'pointer',
        transition: 'transform 200ms ease',
        '&:hover': {
          transform: 'scale(1.04)',
        },
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <LazyImage
          src={getImageUrl(movie.poster_path, 'card')}
          alt={`${movie.title} poster`}
          aspectRatio="2 / 3"
          borderRadius={8}
        />

        <Box
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            borderRadius: '4px',
            px: 0.75,
            py: 0.25,
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
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
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

      <Typography
        variant="body2"
        sx={{
          mt: 1,
          fontWeight: 600,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {movie.title}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {getYear(movie.release_date)}
      </Typography>
    </Box>
  );
});

MovieCard.displayName = 'MovieCard';

export default MovieCard;
