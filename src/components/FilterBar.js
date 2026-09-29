import React from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import ClearAllOutlinedIcon from '@mui/icons-material/ClearAllOutlined';

const currentYear = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 50 }, (_, i) => currentYear - i);

const RATING_OPTIONS = [
  { label: '9+ Excellent', value: 9 },
  { label: '8+ Great', value: 8 },
  { label: '7+ Good', value: 7 },
  { label: '6+ Above Average', value: 6 },
  { label: '5+ Average', value: 5 },
];

const selectSx = {
  minWidth: { xs: 110, sm: 130, md: 140 },
  '& .MuiOutlinedInput-root': {
    borderRadius: '6px',
    backgroundColor: 'background.paper',
    fontSize: '0.875rem',
  },
  '& .MuiInputLabel-root': {
    fontSize: '0.875rem',
  },
};

const FilterBar = ({ genres, filters, onFilterChange, onClear }) => {
  const { genre, year, rating } = filters;
  const hasActiveFilters = genre || year || rating;

  const handleChange = (key) => (e) => {
    onFilterChange({ ...filters, [key]: e.target.value || '' });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 1.5,
        alignItems: 'center',
      }}
    >
      {/* Genre filter */}
      <FormControl size="small" sx={selectSx}>
        <InputLabel id="filter-genre-label">Genre</InputLabel>
        <Select
          labelId="filter-genre-label"
          id="filter-genre"
          value={genre || ''}
          label="Genre"
          onChange={handleChange('genre')}
        >
          <MenuItem value="">All Genres</MenuItem>
          {(genres || []).map((g) => (
            <MenuItem key={g.id} value={g.id}>
              {g.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Year filter */}
      <FormControl size="small" sx={selectSx}>
        <InputLabel id="filter-year-label">Year</InputLabel>
        <Select
          labelId="filter-year-label"
          id="filter-year"
          value={year || ''}
          label="Year"
          onChange={handleChange('year')}
        >
          <MenuItem value="">All Years</MenuItem>
          {YEAR_OPTIONS.map((y) => (
            <MenuItem key={y} value={y}>
              {y}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Rating filter */}
      <FormControl size="small" sx={selectSx}>
        <InputLabel id="filter-rating-label">Rating</InputLabel>
        <Select
          labelId="filter-rating-label"
          id="filter-rating"
          value={rating || ''}
          label="Rating"
          onChange={handleChange('rating')}
        >
          <MenuItem value="">Any Rating</MenuItem>
          {RATING_OPTIONS.map((r) => (
            <MenuItem key={r.value} value={r.value}>
              {r.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Clear filters */}
      {hasActiveFilters && (
        <Button
          size="small"
          variant="outlined"
          onClick={onClear}
          startIcon={<ClearAllOutlinedIcon />}
          sx={{
            borderColor: 'custom.border',
            color: 'text.secondary',
            textTransform: 'none',
            fontSize: '0.8125rem',
            borderRadius: '6px',
            '&:hover': {
              borderColor: 'primary.main',
              color: 'primary.main',
            },
          }}
        >
          Clear Filters
        </Button>
      )}
    </Box>
  );
};

export default FilterBar;
