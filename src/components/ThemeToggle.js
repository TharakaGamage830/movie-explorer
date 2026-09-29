import React from 'react';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import { useThemeContext } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { mode, toggleTheme } = useThemeContext();

  return (
    <Tooltip title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
      <IconButton
        onClick={toggleTheme}
        aria-label={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        id="theme-toggle-btn"
        sx={{
          color: mode === 'light' ? '#111111' : '#F5F5F5',
          transition: 'color 150ms ease',
          '&:hover': {
            color: 'primary.main',
          },
        }}
      >
        {mode === 'dark' ? (
          <LightModeOutlinedIcon sx={{ color: '#F5F5F5' }} />
        ) : (
          <DarkModeOutlinedIcon sx={{ color: '#111111' }} />
        )}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;
