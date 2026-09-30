import { useEffect, useRef } from 'react';
import { useNavSearch } from '../context/NavSearchContext';

// Tracks whether the search bar element is out of view and
// toggles the compact navbar search accordingly.
const useStickySearch = (searchValue, setSearchValue) => {
  const searchBoxRef = useRef(null);
  const { setShowNavSearch, navSearchValue, setNavSearchValue } = useNavSearch();

  // Keep nav search value in sync with the page search value
  useEffect(() => {
    setNavSearchValue(searchValue);
  }, [searchValue, setNavSearchValue]);

  // When user types in nav search, push value back to page
  useEffect(() => {
    if (navSearchValue !== searchValue) {
      setSearchValue(navSearchValue);
    }
    // Only respond to navSearchValue changes from navbar typing
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navSearchValue]);

  // Intersection Observer: show nav search when the inline search scrolls out
  useEffect(() => {
    const node = searchBoxRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowNavSearch(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: '-64px 0px 0px 0px' }
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      setShowNavSearch(false);
    };
  }, [setShowNavSearch]);

  return searchBoxRef;
};

export default useStickySearch;
