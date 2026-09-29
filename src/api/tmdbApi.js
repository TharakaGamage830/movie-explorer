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
      message = 'Network error. Please check your internet connection and try again.';
    } else {
      const { status } = error.response;
      switch (status) {
        case 401:
          message = 'Invalid API key. Please check your TMDb API key in the .env file.';
          break;
        case 404:
          message = 'The requested resource was not found.';
          break;
        case 429:
          message = 'Too many requests. Please wait a moment and try again.';
          break;
        default:
          if (status >= 500) {
            message = 'TMDb server error. Please try again later.';
          }
          break;
      }
    }

    return Promise.reject(new Error(message));
  }
);

export default tmdbApi;
