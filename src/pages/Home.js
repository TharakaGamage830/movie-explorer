
import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import SearchBar from '../components/SearchBar';
import GenreChips from '../components/GenreChips';
import FilterBar from '../components/FilterBar';
import MovieRow from '../components/MovieRow';
import MovieGrid from '../components/MovieGrid';
import HeroSlideshow from '../components/HeroSlideshow';
import { useMovieContext } from '../context/MovieContext';
import useDebounce from '../hooks/useDebounce';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import useStickySearch from '../hooks/useStickySearch';
import { getTrending, getPopular, getNowPlaying, searchMovies, getGenres, discoverMovies } from '../api/movieService';
import { deduplicateMovies } from '../utils/helpers';
import { SEARCH_DEBOUNCE_MS } from '../utils/constants';
import { useLocation } from 'react-router-dom';

const EMPTY_FILTERS = { genre: '', year: '', rating: '' };

const Home = () => {
  const location = useLocation();
  const { lastSearch, setLastSearch } = useMovieContext();

  useEffect(() => {
    if (location.hash) {
      const elementId = location.hash.replace('#', '');
      const element = document.getElementById(elementId);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location.hash]);

  // Search state
  const [searchQuery, setSearchQuery] = useState(lastSearch || '');
  const debouncedQuery = useDebounce(searchQuery, SEARCH_DEBOUNCE_MS);

  // Sticky search - attaches Intersection Observer to the search box ref
  const searchBoxRef = useStickySearch(searchQuery, setSearchQuery);

  // Filter state
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  // Most Recent Movies for the Hero Slideshow
  const [recentHeroMovies, setRecentHeroMovies] = useState([]);

  // Trending data
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingLoading, setTrendingLoading] = useState(true);

  // Popular data
  const [popularMovies, setPopularMovies] = useState([]);
  const [popularLoading, setPopularLoading] = useState(true);

  // Genre data
  const [genres, setGenres] = useState([]);

  // Movie grid (search results, discover results, or now playing grid)
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  // AbortController ref for cancelling stale requests
  const abortControllerRef = useRef(null);

  /**
   * Fetch top 5 most recent movies for the hero auto-play slideshow.
   */
  useEffect(() => {
    let mounted = true;
    const fetchRecentHero = async () => {
      try {
        const data = await getNowPlaying(1);
        if (mounted && data.results) {
          setRecentHeroMovies(data.results.slice(0, 5));
        }
      } catch {
        if (mounted) setRecentHeroMovies([]);
      }
    };
    fetchRecentHero();
    return () => { mounted = false; };
  }, []);

  /**
   * Fetch trending movies for the horizontal row.
   */
  useEffect(() => {
    let mounted = true;
    const fetchTrending = async () => {
      setTrendingLoading(true);
      try {
        const data = await getTrending(1);
        if (mounted) {
          setTrendingMovies(data.results || []);
        }
      } catch (err) {
        if (mounted) setTrendingMovies([]);
      } finally {
        if (mounted) setTrendingLoading(false);
      }
    };
    fetchTrending();
    return () => { mounted = false; };
  }, []);

  // Fetch popular movies for the horizontal row
  useEffect(() => {
    let mounted = true;
    const fetchPopular = async () => {
      setPopularLoading(true);
      try {
        const data = await getPopular(1);
        if (mounted) setPopularMovies(data.results || []);
      } catch {
        if (mounted) setPopularMovies([]);
      } finally {
        if (mounted) setPopularLoading(false);
      }
    };
    fetchPopular();
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

  const hasActiveFilters = Boolean(filters.genre || filters.year || filters.rating);

  /**
   * Fetch movies based on active query and filters using TMDb APIs:
   * - If search query present: uses searchMovies with optional year param
   * - If filters present without search: uses discoverMovies (server-side genre, year, rating)
   * - If neither: uses getNowPlaying
   */
  const fetchMovies = useCallback(
    async (query, currentFilters, pageNum, append = false) => {
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
        let data;
        const activeFilters = Boolean(currentFilters.genre || currentFilters.year || currentFilters.rating);

        if (query) {
          data = await searchMovies(query, pageNum, {
            signal: controller.signal,
            year: currentFilters.year || undefined,
          });
        } else if (activeFilters) {
          data = await discoverMovies(
            {
              genre: currentFilters.genre || undefined,
              year: currentFilters.year || undefined,
              rating: currentFilters.rating || undefined,
              sortBy: 'popularity.desc',
              page: pageNum,
            },
            { signal: controller.signal }
          );
        } else {
          data = await getNowPlaying(pageNum, { signal: controller.signal });
        }

        if (!controller.signal.aborted) {
          let results = data.results || [];
          // If searching with additional genre/rating filters, filter the search results
          if (query && activeFilters) {
            if (currentFilters.genre) {
              results = results.filter((m) => m.genre_ids && m.genre_ids.includes(Number(currentFilters.genre)));
            }
            if (currentFilters.rating) {
              results = results.filter((m) => (m.vote_average || 0) >= currentFilters.rating);
            }
          }

          if (append) {
            setMovies((prev) => deduplicateMovies([...prev, ...results]));
          } else {
            setMovies(results);
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
   * When query or filters change, re-fetch from page 1.
   */
  useEffect(() => {
    setLastSearch(debouncedQuery);
    setPage(1);
    fetchMovies(debouncedQuery, filters, 1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, filters.genre, filters.year, filters.rating]);

  /**
   * Load the next page.
   */
  const loadMore = useCallback(() => {
    if (loadingMore || loading || page >= totalPages) return;
    fetchMovies(debouncedQuery, filters, page + 1, true);
  }, [loadingMore, loading, page, totalPages, debouncedQuery, filters, fetchMovies]);

  // Infinite scroll sentinel
  const sentinelRef = useInfiniteScroll(loadMore, {
    enabled: !loading && !loadingMore && page < totalPages,
  });

  const handleClearFilters = () => {
    setFilters(EMPTY_FILTERS);
  };

  /** Retry the current fetch */
  const handleRetry = () => {
    fetchMovies(debouncedQuery, filters, page, false);
  };

  return (
    <Box component="main">
      {/* Hero Slideshow showing Most Recent 5 Movies */}
      {!debouncedQuery && recentHeroMovies.length > 0 && (
        <HeroSlideshow movies={recentHeroMovies} badgeText="Most Recent" />
      )}

      {/* Main content */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Trending horizontal row (only when not searching) */}
        {!debouncedQuery && (
          <Box id="trending-section">
            <MovieRow
              title="Trending This Week"
              movies={trendingMovies}
              loading={trendingLoading}
              seeAllLink="/trending"
            />
          </Box>
        )}

        {/* Popular horizontal row (only when not searching) */}
        {!debouncedQuery && (
          <Box id="popular-section" sx={{ scrollMarginTop: '80px', mb: 3 }}>
            <MovieRow
              title="Popular Movies"
              movies={popularMovies}
              loading={popularLoading}
              seeAllLink="/popular"
            />
          </Box>
        )}

        {/* Filter bar on left & Search bar on right on same line (observed for sticky nav search) */}
        <Box
          ref={searchBoxRef}
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'stretch', md: 'center' },
            justifyContent: 'space-between',
            gap: 2,
            mb: 2,
            mt: !debouncedQuery ? 2 : 0,
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <FilterBar
              genres={genres}
              filters={filters}
              onFilterChange={setFilters}
              onClear={handleClearFilters}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', md: 300, lg: 340 }, flexShrink: 0 }}>
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </Box>
        </Box>

        {/* Genre chips */}
        <Box sx={{ mb: 3 }}>
          <GenreChips
            genres={genres}
            selectedGenre={filters.genre}
            onSelect={(id) => setFilters((prev) => ({ ...prev, genre: id || '' }))}
          />
        </Box>

        {/* Section heading for grid */}
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
          {debouncedQuery
            ? `Results for "${debouncedQuery}"`
            : hasActiveFilters
            ? 'Filtered Movies'
            : 'Most Recent Movies'}
        </Typography>

        {/* Movie grid with load more / infinite scroll */}
        <MovieGrid
          movies={movies}
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

export default Home;
