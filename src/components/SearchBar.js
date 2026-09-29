import React from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

const SearchBar = ({ value, onChange, size = 'small' }) => (
  <TextField
    id="movie-search-input"
    fullWidth
    size={size}
    variant="outlined"
    placeholder="Search for movies..."
    value={value}
    onChange={(e) => onChange(e.target.value)}
    aria-label="Search for movies"
    slotProps={{
      input: {
        startAdornment: (
          <InputAdornment position="start">
            <SearchOutlinedIcon color="action" fontSize="small" />
          </InputAdornment>
        ),
      },
    }}
    sx={{
      maxWidth: 600,
      '& .MuiOutlinedInput-root': {
        backgroundColor: 'background.paper',
        borderRadius: '6px',
      },
    }}
  />
);

export default SearchBar;
