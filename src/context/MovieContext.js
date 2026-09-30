import React, { createContext, useContext, useMemo, useCallback, useState, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../utils/constants';
import { useAuth } from './AuthContext';

const MovieContext = createContext(undefined);

export const MovieProvider = ({ children }) => {
  const { username } = useAuth();
  const storageKey = username
    ? `${STORAGE_KEYS.favorites}_${username.toLowerCase()}`
    : STORAGE_KEYS.favorites;

  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [lastSearch, setLastSearch] = useLocalStorage(STORAGE_KEYS.lastSearch, '');

  // Sync favorites when the active user switches
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      setFavorites(saved ? JSON.parse(saved) : []);
    } catch {
      setFavorites([]);
    }
  }, [storageKey]);

  // Persist to local storage whenever favorites changes
  const saveFavorites = useCallback(
    (updater) => {
      setFavorites((prev) => {
        const next = typeof updater === 'function' ? updater(prev) : updater;
        try {
          localStorage.setItem(storageKey, JSON.stringify(next));
        } catch (e) {
          console.warn('Failed to save favorites to localStorage', e);
        }
        return next;
      });
    },
    [storageKey]
  );

  const addFavorite = useCallback(
    (movie) => {
      saveFavorites((prev) => {
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
    [saveFavorites]
  );

  const removeFavorite = useCallback(
    (movieId) => {
      saveFavorites((prev) => prev.filter((m) => m.id !== movieId));
    },
    [saveFavorites]
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
