import { TMDB_IMAGE_BASE, IMAGE_SIZES } from './constants';

export const getImageUrl = (path, size = 'card') => {
  if (!path) return null;
  const sizeKey = IMAGE_SIZES[size] || IMAGE_SIZES.card;
  return `${TMDB_IMAGE_BASE}/${sizeKey}${path}`;
};

export const getYear = (dateString) => {
  if (!dateString) return 'N/A';
  return dateString.split('-')[0];
};

export const formatRating = (vote) => {
  if (!vote && vote !== 0) return 'N/A';
  return Number(vote).toFixed(1);
};

export const truncateText = (text, maxLength = 150) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trimEnd() + '...';
};

export const deduplicateMovies = (movies) => {
  const seen = new Set();
  return movies.filter((movie) => {
    if (seen.has(movie.id)) return false;
    seen.add(movie.id);
    return true;
  });
};

export const findTrailer = (videos) => {
  if (!videos || !videos.length) return null;
  const trailer = videos.find(
    (v) => v.site === 'YouTube' && v.type === 'Trailer' && v.official
  );
  if (trailer) return trailer;
  const teaser = videos.find(
    (v) => v.site === 'YouTube' && v.type === 'Teaser'
  );
  return teaser || videos.find((v) => v.site === 'YouTube') || null;
};
