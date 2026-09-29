import React from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';

const GenreChips = ({ genres, selectedGenre, onSelect }) => {
  if (!genres || genres.length === 0) return null;

  return (
    <Box
      role="group"
      aria-label="Filter by genre"
      sx={{
        display: 'flex',
        gap: 1,
        flexWrap: 'wrap',
        py: 1,
      }}
    >
      {genres.map((genre) => {
        const isActive = selectedGenre === genre.id;
        return (
          <Chip
            key={genre.id}
            label={genre.name}
            clickable
            onClick={() => onSelect(isActive ? null : genre.id)}
            aria-pressed={isActive}
            sx={{
              fontWeight: 500,
              fontSize: '0.8125rem',
              backgroundColor: isActive ? 'primary.main' : 'custom.raisedSurface',
              color: isActive ? '#FFFFFF' : 'text.primary',
              border: isActive ? 'none' : '1px solid',
              borderColor: 'custom.border',
              '&:hover': {
                backgroundColor: isActive ? 'primary.main' : 'custom.raisedSurface',
                opacity: 0.9,
              },
            }}
          />
        );
      })}
    </Box>
  );
};

export default GenreChips;
