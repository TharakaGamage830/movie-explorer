import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { getImageUrl, getYear, formatRating, truncateText, findTrailer } from '../utils/helpers';
import { getMovieDetails } from '../api/movieService';
import { YOUTUBE_NOCOOKIE_BASE } from '../utils/constants';

const HeroSlideshow = ({ movies = [], badgeText = 'Featured', autoPlayInterval = 6000 }) => {
  const navigate = useNavigate();
  const slides = movies.slice(0, 5);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [trailerKey, setTrailerKey] = useState(null);
  const [trailerLoading, setTrailerLoading] = useState(false);
  const [trailerMovieTitle, setTrailerMovieTitle] = useState('');

  const timerRef = useRef(null);

  // Auto-play slideshow timer
  useEffect(() => {
    if (slides.length <= 1 || isPaused || trailerOpen) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, autoPlayInterval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [slides.length, isPaused, trailerOpen, autoPlayInterval]);

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handleOpenTrailer = async (movie) => {
    setTrailerMovieTitle(movie.title);
    setTrailerOpen(true);
    setTrailerLoading(true);
    setTrailerKey(null);
    try {
      const details = await getMovieDetails(movie.id);
      const trailer = findTrailer(details.videos?.results || []);
      if (trailer) {
        setTrailerKey(trailer.key);
      }
    } catch {
      // Fallback
    } finally {
      setTrailerLoading(false);
    }
  };

  const handleCloseTrailer = () => {
    setTrailerOpen(false);
    setTrailerKey(null);
  };

  if (!slides || slides.length === 0) return null;

  return (
    <Box
      component="section"
      aria-label="Featured movie slideshow"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      sx={{
        position: 'relative',
        width: '100%',
        minHeight: { xs: 440, sm: 500, md: 560 },
        height: { xs: '65vh', md: '70vh' },
        maxHeight: 650,
        overflow: 'hidden',
        backgroundColor: 'background.default',
      }}
    >
      {/* Background slide layers with smooth crossfade */}
      {slides.map((movie, idx) => {
        const isActive = idx === currentIndex;
        return (
          <Box
            key={movie.id}
            sx={{
              position: 'absolute',
              inset: 0,
              opacity: isActive ? 1 : 0,
              transition: 'opacity 800ms cubic-bezier(0.4, 0, 0.2, 1)',
              backgroundImage: movie.backdrop_path
                ? `url(${getImageUrl(movie.backdrop_path, 'hero')})`
                : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center top',
              pointerEvents: isActive ? 'auto' : 'none',
            }}
          >
            {/* Cinematic Gradient overlay */}
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                background: (theme) => `
                  linear-gradient(to top, ${theme.palette.background.default} 0%, rgba(0, 0, 0, 0.6) 45%, rgba(0, 0, 0, 0.75) 100%),
                  linear-gradient(to right, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.4) 60%, transparent 100%)
                `,
              }}
            />

            {/* Slide Content */}
            <Container
              maxWidth="lg"
              sx={{
                position: 'relative',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                pb: { xs: 6, md: 8 },
                pt: 8,
              }}
            >
              <Box
                sx={{
                  maxWidth: { xs: '100%', sm: 600, md: 680 },
                  transform: isActive ? 'translateY(0)' : 'translateY(12px)',
                  transition: 'transform 600ms cubic-bezier(0.2, 0.8, 0.2, 1)',
                }}
              >
                {/* Badge & Meta */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5, flexWrap: 'wrap' }}>
                  {badgeText && (
                    <Chip
                      label={badgeText}
                      size="small"
                      sx={{
                        backgroundColor: 'primary.main',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        height: 24,
                        letterSpacing: '0.5px',
                        textTransform: 'uppercase',
                      }}
                    />
                  )}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      backgroundColor: 'rgba(0, 0, 0, 0.65)',
                      px: 1,
                      py: 0.35,
                      borderRadius: 1,
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                    }}
                  >
                    <StarOutlinedIcon sx={{ fontSize: 16, color: 'secondary.main' }} />
                    <Typography variant="caption" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                      {formatRating(movie.vote_average)}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 500 }}>
                    {getYear(movie.release_date)}
                  </Typography>
                </Box>

                {/* Title */}
                <Typography
                  variant="h1"
                  component="h1"
                  sx={{
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontSize: { xs: '1.85rem', sm: '2.5rem', md: '3.1rem' },
                    lineHeight: 1.15,
                    mb: 1.5,
                    textShadow: '0 2px 10px rgba(0, 0, 0, 0.7)',
                  }}
                >
                  {movie.title}
                </Typography>

                {/* Overview */}
                <Typography
                  variant="body1"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.82)',
                    fontSize: { xs: '0.9rem', md: '1rem' },
                    lineHeight: 1.5,
                    mb: 3,
                    maxWidth: 580,
                    textShadow: '0 1px 4px rgba(0, 0, 0, 0.8)',
                    display: '-webkit-box',
                    WebkitLineClamp: { xs: 2, md: 3 },
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {truncateText(movie.overview, 180)}
                </Typography>

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={<PlayArrowIcon />}
                    onClick={() => handleOpenTrailer(movie)}
                    sx={{
                      fontWeight: 600,
                      px: 3,
                      boxShadow: '0 4px 14px rgba(229, 9, 20, 0.4)',
                    }}
                  >
                    Watch Trailer
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<InfoOutlinedIcon />}
                    onClick={() => navigate(`/movie/${movie.id}`)}
                    sx={{
                      fontWeight: 600,
                      px: 3,
                      color: '#FFFFFF',
                      borderColor: 'rgba(255, 255, 255, 0.4)',
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      backdropFilter: 'blur(6px)',
                      '&:hover': {
                        borderColor: '#FFFFFF',
                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                      },
                    }}
                  >
                    More Info
                  </Button>
                </Box>
              </Box>
            </Container>
          </Box>
        );
      })}

      {/* Prev / Next navigation arrows */}
      {slides.length > 1 && (
        <>
          <IconButton
            onClick={handlePrev}
            aria-label="Previous slide"
            sx={{
              position: 'absolute',
              left: { xs: 8, md: 24 },
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#FFFFFF',
              backgroundColor: 'rgba(0, 0, 0, 0.45)',
              backdropFilter: 'blur(4px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              zIndex: 3,
              width: { xs: 36, md: 44 },
              height: { xs: 36, md: 44 },
              '&:hover': {
                backgroundColor: 'rgba(229, 9, 20, 0.8)',
                borderColor: 'primary.main',
              },
            }}
          >
            <ArrowBackIosNewIcon sx={{ fontSize: { xs: 16, md: 20 } }} />
          </IconButton>
          <IconButton
            onClick={handleNext}
            aria-label="Next slide"
            sx={{
              position: 'absolute',
              right: { xs: 8, md: 24 },
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#FFFFFF',
              backgroundColor: 'rgba(0, 0, 0, 0.45)',
              backdropFilter: 'blur(4px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              zIndex: 3,
              width: { xs: 36, md: 44 },
              height: { xs: 36, md: 44 },
              '&:hover': {
                backgroundColor: 'rgba(229, 9, 20, 0.8)',
                borderColor: 'primary.main',
              },
            }}
          >
            <ArrowForwardIosIcon sx={{ fontSize: { xs: 16, md: 20 } }} />
          </IconButton>
        </>
      )}

      {/* Pagination slide indicators */}
      {slides.length > 1 && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 20,
            right: { xs: '50%', md: 40 },
            transform: { xs: 'translateX(50%)', md: 'none' },
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            zIndex: 3,
          }}
        >
          {slides.map((_, dotIdx) => {
            const isDotActive = dotIdx === currentIndex;
            return (
              <Box
                key={dotIdx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(dotIdx);
                }}
                role="button"
                tabIndex={0}
                aria-label={`Go to slide ${dotIdx + 1}`}
                sx={{
                  width: isDotActive ? 28 : 10,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: isDotActive ? 'primary.main' : 'rgba(255, 255, 255, 0.4)',
                  cursor: 'pointer',
                  transition: 'all 300ms ease',
                  '&:hover': {
                    backgroundColor: isDotActive ? 'primary.main' : 'rgba(255, 255, 255, 0.75)',
                  },
                }}
              />
            );
          })}
        </Box>
      )}

      {/* Trailer Dialog Modal */}
      <Dialog
        open={trailerOpen}
        onClose={handleCloseTrailer}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: '#000000',
            borderRadius: 2,
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1.5 }}>
          <Typography variant="subtitle1" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
            {trailerMovieTitle} - Official Trailer
          </Typography>
          <IconButton onClick={handleCloseTrailer} sx={{ color: '#FFFFFF' }} aria-label="Close trailer">
            <CloseIcon />
          </IconButton>
        </Box>
        <DialogContent sx={{ p: 0, aspectRatio: '16 / 9', backgroundColor: '#000000' }}>
          {trailerLoading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                Loading trailer...
              </Typography>
            </Box>
          ) : trailerKey ? (
            <iframe
              width="100%"
              height="100%"
              src={`${YOUTUBE_NOCOOKIE_BASE}/${trailerKey}?autoplay=1`}
              title={`${trailerMovieTitle} Trailer`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                Trailer not available for this movie.
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default HeroSlideshow;
