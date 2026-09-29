import tmdbApi from './tmdbApi';

export const getTrending = async (page = 1, { signal } = {}) => {
  const response = await tmdbApi.get('/trending/movie/week', {
    params: { page },
    signal,
  });
  return response.data;
};

export const searchMovies = async (query, page = 1, { signal } = {}) => {
  const response = await tmdbApi.get('/search/movie', {
    params: { query, page },
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
