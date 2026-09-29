
import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import SearchBar from '../components/SearchBar';
import GenreChips from '../components/GenreChips';
import MovieRow from '../components/MovieRow';
import MovieGrid from '../components/MovieGrid';
import { useMovieContext } from '../context/MovieContext';
import useDebounce from '../hooks/useDebounce';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import { getTrending, searchMovies, getGenres } from '../api/movieService';
import { getImageUrl, truncateText, deduplicateMovies } from '../utils/helpers';
import { SEARCH_DEBOUNCE_MS, YOUTUBE_NOCOOKIE_BASE } from '../utils/constants';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const { lastSearch, setLastSearch } = useMovieContext();

  // Search state
  const [searchQuery, setSearchQuery] = useState(lastSearch || '');
  const debouncedQuery = useDebounce(searchQuery, SEARCH_DEBOUNCE_MS);

  // Trending data
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingLoading, setTrendingLoading] = useState(true);
  const [heroMovie, setHeroMovie] = useState(null);

  // Genre data
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);

  // Movie grid (search results or trending grid)
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  // Trailer state (lazy loaded on click)
  const [showTrailer, setShowTrailer] = useState(false);

  // AbortController ref for cancelling stale requests
  const abortControllerRef = useRef(null);

  /**
   * Fetch trending movies for the hero and the horizontal row.
   */
  useEffect(() => {
    let mounted = true;
    const fetchTrending = async () => {
      setTrendingLoading(true);
      try {
        const data = await getTrending(1);
        if (mounted) {
          setTrendingMovies(data.results || []);
          if (data.results && data.results.length > 0) {
            setHeroMovie(data.results[0]);
          }
        }
      } catch (err) {
        // Non-critical: trending row just stays empty
        if (mounted) setTrendingMovies([]);
      } finally {
        if (mounted) setTrendingLoading(false);
      }
    };
    fetchTrending();
    return () => { mounted = false; };
  }, []);

  /**
   * Fetch genres on mount.
   */
  useEffect(() => {
    let mounted = true;
    const fetchGenres = async () => {
      try {
        const data = await getGenres();
        if (mounted) setGenres(data);
      } catch {
        // Non-critical: genre chips just do not appear
      }
    };
    fetchGenres();
    return () => { mounted = false; };
  }, []);

  /**
   * Fetch movies: either search results or trending, depending on query.
   * Cancels any in-flight request when the query changes.
   */
  const fetchMovies = useCallback(
    async (query, pageNum, append = false) => {
      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setError(null);
      }

      try {
        const data = query
          ? await searchMovies(query, pageNum, { signal: controller.signal })
          : await getTrending(pageNum, { signal: controller.signal });

        if (!controller.signal.aborted) {
          if (append) {
            setMovies((prev) => deduplicateMovies([...prev, ...(data.results || [])]));
          } else {
            setMovies(data.results || []);
          }
          setTotalPages(data.total_pages || 1);
          setPage(pageNum);
        }
      } catch (err) {
        if (!axios.isCancel(err) && !controller.signal.aborted) {
          setError(err.message || 'Failed to load movies.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    },
    []
  );

  /**
   * When the debounced query changes, reset and fetch page 1.
   * Also persist the search query in context.
   */
  useEffect(() => {
    setLastSearch(debouncedQuery);
    setPage(1);
    setSelectedGenre(null);
    fetchMovies(debouncedQuery, 1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  /**
   * Load the next page.
   */
  const loadMore = useCallback(() => {
    if (loadingMore || loading || page >= totalPages) return;
    fetchMovies(debouncedQuery, page + 1, true);
  }, [loadingMore, loading, page, totalPages, debouncedQuery, fetchMovies]);

  // Infinite scroll sentinel
  const sentinelRef = useInfiniteScroll(loadMore, {
    enabled: !loading && !loadingMore && page < totalPages,
  });

  /**
   * Filter displayed movies by selected genre (client-side filter).
   */
  const displayedMovies = selectedGenre
    ? movies.filter((m) => m.genre_ids && m.genre_ids.includes(selectedGenre))
    : movies;

  /** Retry the current fetch */
  const handleRetry = () => {
    fetchMovies(debouncedQuery, page, false);
  };

  return (
    <Box component="main">
      {/* Hero Banner */}
      {heroMovie && !debouncedQuery && (
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            minHeight: { xs: 400, md: 520 },
            backgroundImage: `url(${getImageUrl(heroMovie.backdrop_path, 'hero')})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            display: 'flex',
            alignItems: 'flex-end',
          }}
        >
          {/* Gradient fade to background */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to top, var(--hero-bg) 0%, transparent 60%)',
              '--hero-bg': (theme) => theme.palette.background.default,
            }}
          />
          <Container maxWidth="lg" sx={{ position: 'relative', pb: 6, pt: 12 }}>
            <Typography
              variant="h1"
              component="h1"
              sx={{
                mb: 1,
                maxWidth: 600,
                fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
              }}
            >
              {heroMovie.title}
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 3, maxWidth: 500 }}
            >
              {truncateText(heroMovie.overview, 180)}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<PlayArrowOutlinedIcon />}
                onClick={() => setShowTrailer(true)}
                id="hero-watch-trailer-btn"
              >
                Watch Trailer
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate(`/movie/${heroMovie.id}`)}
                sx={{
                  borderColor: 'custom.border',
                  color: 'text.primary',
                  '&:hover': { borderColor: 'text.primary' },
                }}
                id="hero-more-info-btn"
              >
                More Info
              </Button>
            </Box>

            {/* Lazy-loaded trailer embed (only rendered on user click) */}
            {showTrailer && heroMovie.id && (
              <Box sx={{ mt: 3, maxWidth: 640, aspectRatio: '16 / 9' }}>
                <TrailerEmbed movieId={heroMovie.id} />
              </Box>
            )}
          </Container>
        </Box>
      )}

      {/* Main content */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Search bar */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </Box>

        {/* Genre chips */}
        <Box sx={{ mb: 3 }}>
          <GenreChips
            genres={genres}
            selectedGenre={selectedGenre}
            onSelect={setSelectedGenre}
          />
        </Box>

        {/* Trending horizontal row (only when not searching) */}
        {!debouncedQuery && (
          <MovieRow
            title="Trending This Week"
            movies={trendingMovies}
            loading={trendingLoading}
          />
        )}

        {/* Section heading */}
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
          {debouncedQuery ? `Results for "${debouncedQuery}"` : 'Popular Movies'}
        </Typography>

        {/* Movie grid with infinite scroll */}
        <MovieGrid
          movies={displayedMovies}
          loading={loading}
          loadingMore={loadingMore}
          error={error}
          hasMore={page < totalPages}
          onLoadMore={loadMore}
          onRetry={handleRetry}
          sentinelRef={sentinelRef}
        />
      </Container>
    </Box>
  );
};

// Loads and embeds YouTube trailer on demand
const TrailerEmbed = ({ movieId }) => {
  const [trailerKey, setTrailerKey] = useState(null);
  const [trailerLoading, setTrailerLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchTrailer = async () => {
      try {
        // Import dynamically to avoid circular deps
        const { getMovieDetails } = await import('../api/movieService');
        const { findTrailer } = await import('../utils/helpers');
        const data = await getMovieDetails(movieId);
        const trailer = findTrailer(data.videos?.results || []);
        if (mounted && trailer) {
          setTrailerKey(trailer.key);
        }
      } catch {
        // Trailer is not available - non-critical
      } finally {
        if (mounted) setTrailerLoading(false);
      }
    };
    fetchTrailer();
    return () => { mounted = false; };
  }, [movieId]);

  if (trailerLoading) {
    return (
      <Typography variant="body2" color="text.secondary">
        Loading trailer...
      </Typography>
    );
  }

  if (!trailerKey) {
    return (
      <Typography variant="body2" color="text.secondary">
        Trailer not available.
      </Typography>
    );
  }

  return (
    <iframe
      width="100%"
      height="100%"
      src={`${YOUTUBE_NOCOOKIE_BASE}/${trailerKey}`}
      title="Movie Trailer"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      style={{ borderRadius: 8 }}
    />
  );
};

export default Home;
