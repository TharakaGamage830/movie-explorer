import tmdbApi from './tmdbApi';

export const getTrending = async (page = 1, { signal } = {}) => {
  const response = await tmdbApi.get('/trending/movie/week', {
    params: { page },
    signal,
  });
  return response.data;
};

export const getPopular = async (page = 1, { signal } = {}) => {
  const response = await tmdbApi.get('/movie/popular', {
    params: { page },
    signal,
  });
  return response.data;
};

export const getNowPlaying = async (page = 1, { signal } = {}) => {
  const response = await tmdbApi.get('/movie/now_playing', {
    params: { page },
    signal,
  });
  return response.data;
};

export const searchMovies = async (query, page = 1, { signal, year } = {}) => {
  const params = { query, page };
  if (year) params.primary_release_year = year;
  const response = await tmdbApi.get('/search/movie', {
    params,
    signal,
  });
  return response.data;
};

export const getMovieDetails = async (id, { signal } = {}) => {
  const response = await tmdbApi.get(`/movie/${id}`, {
    params: { append_to_response: 'credits,videos' },
    signal,
  });
  return response.data;
};

export const getGenres = async () => {
  const response = await tmdbApi.get('/genre/movie/list');
  return response.data.genres;
};

export const getSimilarMovies = async (id, page = 1, { signal } = {}) => {
  const response = await tmdbApi.get(`/movie/${id}/similar`, {
    params: { page },
    signal,
  });
  return response.data;
};

export const discoverMovies = async (
  { genre, year, rating, sortBy = 'popularity.desc', page = 1 } = {},
  { signal } = {}
) => {
  const params = { page, sort_by: sortBy };
  if (genre) params.with_genres = genre;
  if (year) params.primary_release_year = year;
  if (rating) {
    params['vote_average.gte'] = rating;
    params['vote_count.gte'] = 30;
  }
  const response = await tmdbApi.get('/discover/movie', {
    params,
    signal,
  });
  return response.data;
};

