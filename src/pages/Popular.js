import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import MovieGrid from '../components/MovieGrid';
import HeroSlideshow from '../components/HeroSlideshow';
import { getPopular, getGenres, searchMovies, discoverMovies } from '../api/movieService';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import useStickySearch from '../hooks/useStickySearch';
import useDebounce from '../hooks/useDebounce';
import { deduplicateMovies } from '../utils/helpers';
import { SEARCH_DEBOUNCE_MS } from '../utils/constants';

const EMPTY_FILTERS = { genre: '', year: '', rating: '' };

const Popular = () => {
  const [movies, setMovies] = useState([]);
  const [heroMovies, setHeroMovies] = useState([]);
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

  // Fetch stable top 5 popular movies for Hero
  useEffect(() => {
    let mounted = true;
    const fetchHero = async () => {
      try {
        const data = await getPopular(1);
        if (mounted && data.results) {
          setHeroMovies(data.results.slice(0, 5));
        }
      } catch {
        if (mounted) setHeroMovies([]);
      }
    };
    fetchHero();
    return () => { mounted = false; };
  }, []);

  const hasActiveFilters = Boolean(filters.genre || filters.year || filters.rating);

  const fetchMovies = useCallback(
    async (query, currentFilters, pageNum, append = false) => {
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
          data = await getPopular(pageNum, { signal: controller.signal });
        }

        if (!controller.signal.aborted) {
          let results = data.results || [];
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
          setError(err.message || 'Unable to load popular movies.');
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

  useEffect(() => {
    setPage(1);
    fetchMovies(debouncedQuery, filters, 1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, filters.genre, filters.year, filters.rating]);

  const loadMore = useCallback(() => {
    if (loadingMore || loading || page >= totalPages) return;
    fetchMovies(debouncedQuery, filters, page + 1, true);
  }, [loadingMore, loading, page, totalPages, debouncedQuery, filters, fetchMovies]);

  const sentinelRef = useInfiniteScroll(loadMore, {
    enabled: !loading && !loadingMore && page < totalPages,
  });

  const handleClearFilters = () => {
    setFilters(EMPTY_FILTERS);
    setSearchQuery('');
  };

  return (
    <Box component="main">
      {/* Hero Slideshow showing Top 5 Popular Movies */}
      {!debouncedQuery && heroMovies.length > 0 && (
        <HeroSlideshow movies={heroMovies} badgeText="Popular Right Now" />
      )}

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
            {debouncedQuery
              ? `Results for "${debouncedQuery}"`
              : hasActiveFilters
              ? 'Filtered Popular Movies'
              : 'Popular Movies'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Explore all-time favorite and crowd-pleaser films.
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
          movies={movies}
          loading={loading}
          loadingMore={loadingMore}
          error={error}
          hasMore={page < totalPages}
          onLoadMore={loadMore}
          onRetry={() => fetchMovies(debouncedQuery, filters, page, false)}
          sentinelRef={sentinelRef}
        />
      </Container>
    </Box>
  );
};

export default Popular;
