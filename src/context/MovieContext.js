import React, { createContext, useContext, useMemo, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../utils/constants';

const MovieContext = createContext(undefined);

export const MovieProvider = ({ children }) => {
  const [favorites, setFavorites] = useLocalStorage(STORAGE_KEYS.favorites, []);
  const [lastSearch, setLastSearch] = useLocalStorage(STORAGE_KEYS.lastSearch, '');

  const addFavorite = useCallback(
    (movie) => {
      setFavorites((prev) => {
        if (prev.some((m) => m.id === movie.id)) return prev;
        return [
          ...prev,
          {
            id: movie.id,
            title: movie.title,
            poster_path: movie.poster_path,
            release_date: movie.release_date,
            vote_average: movie.vote_average,
          },
        ];
      });
    },
    [setFavorites]
  );

  const removeFavorite = useCallback(
    (movieId) => {
      setFavorites((prev) => prev.filter((m) => m.id !== movieId));
    },
    [setFavorites]
  );

  const isFavorite = useCallback(
    (movieId) => favorites.some((m) => m.id === movieId),
    [favorites]
  );

  const value = useMemo(
    () => ({
      favorites,
      lastSearch,
      setLastSearch,
      addFavorite,
      removeFavorite,
      isFavorite,
    }),
    [favorites, lastSearch, setLastSearch, addFavorite, removeFavorite, isFavorite]
  );

  return <MovieContext.Provider value={value}>{children}</MovieContext.Provider>;
};

export const useMovieContext = () => {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error('useMovieContext must be used within a MovieProvider');
  }
  return context;
};
