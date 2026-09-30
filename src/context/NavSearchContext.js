import React, { createContext, useContext, useState, useCallback } from 'react';

const NavSearchContext = createContext();

export const NavSearchProvider = ({ children }) => {
  const [showNavSearch, setShowNavSearch] = useState(false);
  const [navSearchValue, setNavSearchValue] = useState('');

  const updateNavSearch = useCallback((value) => {
    setNavSearchValue(value);
  }, []);

  return (
    <NavSearchContext.Provider
      value={{ showNavSearch, setShowNavSearch, navSearchValue, updateNavSearch, setNavSearchValue }}
    >
      {children}
    </NavSearchContext.Provider>
  );
};

export const useNavSearch = () => useContext(NavSearchContext);
