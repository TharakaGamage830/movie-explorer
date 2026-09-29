
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import LazyImage from '../components/LazyImage';
import { getMovieDetails } from '../api/movieService';
import { useMovieContext } from '../context/MovieContext';
import {
  getImageUrl,
  getYear,
  formatRating,
  findTrailer,
} from '../utils/helpers';
import { YOUTUBE_NOCOOKIE_BASE } from '../utils/constants';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isFavorite, addFavorite, removeFavorite } = useMovieContext();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);

  /** Fetch movie details with credits and videos */
  useEffect(() => {
    let mounted = true;
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getMovieDetails(id);
        if (mounted) setMovie(data);
      } catch (err) {
        if (mounted) setError(err.message || 'Failed to load movie details.');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchDetails();
    return () => { mounted = false; };
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;
  if (!movie) return null;

  const favorite = isFavorite(movie.id);
  const trailer = findTrailer(movie.videos?.results || []);
  const cast = movie.credits?.cast?.slice(0, 12) || [];
  const director = movie.credits?.crew?.find((c) => c.job === 'Director');
  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : null;

  return (
    <Box component="main">
      {/* Backdrop image */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          minHeight: { xs: 250, md: 400 },
          backgroundImage: movie.backdrop_path
            ? `url(${getImageUrl(movie.backdrop_path, 'hero')})`
            : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to top, var(--bg) 0%, transparent 70%)',
            '--bg': (theme) => theme.palette.background.default,
          }}
        />
        {/* Back button */}
        <Container maxWidth="lg" sx={{ position: 'relative', pt: 2 }}>
          <IconButton
            onClick={() => navigate(-1)}
            aria-label="Go back"
            sx={{
              color: 'text.primary',
              backgroundColor: 'rgba(0,0,0,0.4)',
              '&:hover': { backgroundColor: 'rgba(0,0,0,0.6)' },
            }}
            id="back-btn"
          >
            <ArrowBackOutlinedIcon />
          </IconButton>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: { xs: -8, md: -12 }, position: 'relative', pb: 6 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 4,
          }}
        >
          {/* Poster */}
          <Box sx={{ flexShrink: 0, width: { xs: 200, md: 300 }, mx: { xs: 'auto', md: 0 } }}>
            <LazyImage
              src={getImageUrl(movie.poster_path, 'detail')}
              alt={`${movie.title} poster`}
              aspectRatio="2 / 3"
              borderRadius={8}
            />
          </Box>

          {/* Info */}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h2"
              component="h1"
              sx={{
                mb: 1,
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.375rem' },
              }}
            >
              {movie.title}
            </Typography>

            {/* Meta row: year, runtime, rating */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
              <Typography variant="body2" color="text.secondary">
                {getYear(movie.release_date)}
              </Typography>
              {runtime && (
                <Typography variant="body2" color="text.secondary">
                  {runtime}
                </Typography>
              )}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <StarOutlinedIcon sx={{ fontSize: 18, color: 'secondary.main' }} />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {formatRating(movie.vote_average)}
                </Typography>
              </Box>
            </Box>

            {/* Genres */}
            {movie.genres && movie.genres.length > 0 && (
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                {movie.genres.map((g) => (
                  <Chip
                    key={g.id}
                    label={g.name}
                    size="small"
                    sx={{
                      backgroundColor: 'custom.raisedSurface',
                      border: '1px solid',
                      borderColor: 'custom.border',
                    }}
                  />
                ))}
              </Box>
            )}

            {/* Overview */}
            <Typography variant="body1" sx={{ mb: 3, maxWidth: 700 }}>
              {movie.overview || 'No overview available.'}
            </Typography>

            {/* Director */}
            {director && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Directed by {director.name}
              </Typography>
            )}

            {/* Action buttons */}
            <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
              {trailer && (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<PlayArrowOutlinedIcon />}
                  onClick={() => setShowTrailer(!showTrailer)}
                  id="detail-watch-trailer-btn"
                >
                  {showTrailer ? 'Hide Trailer' : 'Watch Trailer'}
                </Button>
              )}
              <Button
                variant="outlined"
                onClick={() =>
                  favorite ? removeFavorite(movie.id) : addFavorite(movie)
                }
                startIcon={
                  favorite ? (
                    <FavoriteIcon sx={{ color: 'primary.main' }} />
                  ) : (
                    <FavoriteBorderOutlinedIcon />
                  )
                }
                sx={{
                  borderColor: 'custom.border',
                  color: 'text.primary',
                  '&:hover': { borderColor: 'text.primary' },
                }}
                id="detail-favorite-btn"
              >
                {favorite ? 'Remove from Favorites' : 'Add to Favorites'}
              </Button>
            </Box>

            {/* Lazy-loaded trailer */}
            {showTrailer && trailer && (
              <Box sx={{ mb: 4, maxWidth: 700, aspectRatio: '16 / 9' }}>
                <iframe
                  width="100%"
                  height="100%"
                  src={`${YOUTUBE_NOCOOKIE_BASE}/${trailer.key}`}
                  title={`${movie.title} Trailer`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ borderRadius: 8 }}
                />
              </Box>
            )}

            {/* Cast */}
            {cast.length > 0 && (
              <>
                <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
                  Cast
                </Typography>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: 'repeat(3, 1fr)',
                      sm: 'repeat(4, 1fr)',
                      md: 'repeat(6, 1fr)',
                    },
                    gap: 2,
                  }}
                >
                  {cast.map((person) => (
                    <Box key={person.credit_id} sx={{ textAlign: 'center' }}>
                      <LazyImage
                        src={getImageUrl(person.profile_path, 'card')}
                        alt={`${person.name} photo`}
                        aspectRatio="2 / 3"
                        borderRadius={8}
                      />
                      <Typography variant="caption" sx={{ mt: 0.5, fontWeight: 600, display: 'block' }}>
                        {person.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        {person.character}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default MovieDetails;
