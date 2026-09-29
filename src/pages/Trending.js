import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import MovieGrid from '../components/MovieGrid';
import HeroSlideshow from '../components/HeroSlideshow';
import { getTrending, getGenres } from '../api/movieService';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import useStickySearch from '../hooks/useStickySearch';
import useDebounce from '../hooks/useDebounce';
import { deduplicateMovies } from '../utils/helpers';
import { SEARCH_DEBOUNCE_MS } from '../utils/constants';

const EMPTY_FILTERS = { genre: '', year: '', rating: '' };

const Trending = () => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [genres, setGenres] = useState([]);

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, SEARCH_DEBOUNCE_MS);
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  // Sticky search
  const searchBoxRef = useStickySearch(searchQuery, setSearchQuery);

  const abortControllerRef = useRef(null);

  // Fetch genres
  useEffect(() => {
    let mounted = true;
    const fetchGenres = async () => {
      try {
        const data = await getGenres();
        if (mounted) setGenres(data);
      } catch {
        // Non-critical
      }
    };
    fetchGenres();
    return () => { mounted = false; };
  }, []);

  const fetchTrendingMovies = useCallback(async (pageNum, append = false) => {
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
      const data = await getTrending(pageNum, { signal: controller.signal });
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
        setError(err.message || 'Unable to load trending movies.');
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
        setLoadingMore(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchTrendingMovies(1, false);
  }, [fetchTrendingMovies]);

  const loadMore = useCallback(() => {
    if (loadingMore || loading || page >= totalPages) return;
    fetchTrendingMovies(page + 1, true);
  }, [loadingMore, loading, page, totalPages, fetchTrendingMovies]);

  const sentinelRef = useInfiniteScroll(loadMore, {
    enabled: !loading && !loadingMore && page < totalPages,
  });

  // Client-side filtering (search + filters)
  const displayedMovies = movies.filter((m) => {
    // Text search filter
    if (debouncedQuery) {
      const q = debouncedQuery.toLowerCase();
      if (!(m.title || '').toLowerCase().includes(q)) return false;
    }
    if (filters.genre && !(m.genre_ids && m.genre_ids.includes(filters.genre))) {
      return false;
    }
    if (filters.year) {
      const movieYear = m.release_date ? parseInt(m.release_date.split('-')[0], 10) : null;
      if (movieYear !== filters.year) return false;
    }
    if (filters.rating && (m.vote_average || 0) < filters.rating) {
      return false;
    }
    return true;
  });

  const handleClearFilters = () => {
    setFilters(EMPTY_FILTERS);
    setSearchQuery('');
  };

  return (
    <Box component="main">
      {/* Hero Slideshow showing Top 5 Trending Movies */}
      {!debouncedQuery && movies.length > 0 && (
        <HeroSlideshow movies={movies.slice(0, 5)} badgeText="Trending Now" />
      )}

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
            Trending Movies
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Discover what is buzzing this week in cinema.
          </Typography>
        </Box>

        {/* Filter bar on left & Search bar on right on same line (observed for sticky nav search) */}
        <Box
          ref={searchBoxRef}
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'stretch', md: 'center' },
            justifyContent: 'space-between',
            gap: 2,
            mb: 3,
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

        <MovieGrid
          movies={displayedMovies}
          loading={loading}
          loadingMore={loadingMore}
          error={error}
          hasMore={page < totalPages}
          onLoadMore={loadMore}
          onRetry={() => fetchTrendingMovies(page, false)}
          sentinelRef={sentinelRef}
        />
      </Container>
    </Box>
  );
};

export default Trending;
