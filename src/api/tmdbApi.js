import axios from 'axios';

const tmdbApi = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: process.env.REACT_APP_TMDB_API_KEY,
  },
});

tmdbApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    let message = 'Something went wrong. Please try again.';

    if (!error.response) {
      message = 'Unable to connect. Please check your internet connection and try again.';
    } else {
      const { status } = error.response;
      switch (status) {
        case 401:
          // Keep internal details in dev console only, show clean user message
          if (process.env.NODE_ENV === 'development') {
            console.error('TMDb API authorization error. Check API configuration.');
          }
          message = 'Unable to load movie data at this time. Please try again later.';
          break;
        case 404:
          message = 'The requested content could not be found.';
          break;
        case 429:
          message = 'Service is busy right now. Please wait a moment and try again.';
          break;
        default:
          if (status >= 500) {
            message = 'Movie service is temporarily unavailable. Please try again later.';
          }
          break;
      }
    }

    return Promise.reject(new Error(message));
  }
);

export default tmdbApi;
