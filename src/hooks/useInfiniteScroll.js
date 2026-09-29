import { useEffect, useRef, useCallback } from 'react';

const useInfiniteScroll = (onIntersect, { enabled = true, rootMargin = '200px' } = {}) => {
  const observerRef = useRef(null);
  const callbackRef = useRef(onIntersect);

  useEffect(() => {
    callbackRef.current = onIntersect;
  }, [onIntersect]);

  const sentinelRef = useCallback(
    (node) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      if (!node || !enabled) return;

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            callbackRef.current();
          }
        },
        { rootMargin }
      );

      observerRef.current.observe(node);
    },
    [enabled, rootMargin]
  );

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return sentinelRef;
};

export default useInfiniteScroll;
