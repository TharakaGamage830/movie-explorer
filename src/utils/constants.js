export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

export const IMAGE_SIZES = {
  card: 'w342',
  detail: 'w500',
  hero: 'w1280',
  original: 'original',
};

// Set to false to use the manual Load More button instead of infinite scroll
export const INFINITE_SCROLL = true;

export const SEARCH_DEBOUNCE_MS = 400;
export const SKELETON_COUNT = 12;

export const STORAGE_KEYS = {
  theme: 'movie-explorer-theme',
  favorites: 'movie-explorer-favorites',
  lastSearch: 'movie-explorer-last-search',
  isLoggedIn: 'movie-explorer-logged-in',
  username: 'movie-explorer-username',
};

export const YOUTUBE_NOCOOKIE_BASE = 'https://www.youtube-nocookie.com/embed';
export const MIN_PASSWORD_LENGTH = 6;

export const EMPTY_STATE_MESSAGES = {
  noResults: 'No movies found matching your search.',
  noFavorites: 'You have not saved any favorites yet. Start exploring and add some!',
  endOfResults: 'You have reached the end.',
};
