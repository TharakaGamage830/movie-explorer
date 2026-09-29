import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import Collapse from '@mui/material/Collapse';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ showNavSearch, navSearchValue, onNavSearchChange }) => {
  const { isLoggedIn, username, logout } = useAuth();
  const location = useLocation();

  const navLinkStyle = (isActive = false) => ({
    color: isActive ? 'primary.main' : 'text.primary',
    fontWeight: isActive ? 600 : 500,
    fontSize: '0.9rem',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'color 160ms ease, opacity 160ms ease',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 0.5,
    userSelect: 'none',
    '&:hover': {
      color: 'primary.main',
      opacity: 0.9,
    },
  });

  return (
    <AppBar position="sticky" component="nav" aria-label="Main navigation">
      <Toolbar
        sx={{
          justifyContent: 'space-between',
          maxWidth: 1280,
          width: '100%',
          mx: 'auto',
          px: { xs: 2, sm: 3 },
          minHeight: '64px',
        }}
      >
        {/* Left Side: Brand and Navigation Links */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 3 } }}>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              color: 'primary.main',
              fontWeight: 700,
              textDecoration: 'none',
              textTransform: 'uppercase',
              fontSize: { xs: '0.875rem', sm: '1.125rem' },
              letterSpacing: '0.05em',
              mr: { xs: 0, sm: 1 },
            }}
          >
            Movie Explorer
          </Typography>

          <Link
            component={RouterLink}
            to="/"
            sx={navLinkStyle(location.pathname === '/')}
          >
            Home
          </Link>

          <Link
            component={RouterLink}
            to="/trending"
            sx={navLinkStyle(location.pathname === '/trending')}
          >
            Trending Movies
          </Link>

          <Link
            component={RouterLink}
            to="/popular"
            sx={navLinkStyle(location.pathname === '/popular')}
          >
            Popular
          </Link>
        </Box>

        {/* Right Side: Sticky Search, Favorites, Theme Toggle, User/Auth */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2.5 } }}>
          {/* Compact search that appears when page search bar scrolls out */}
          <Collapse in={showNavSearch} orientation="horizontal" timeout={250}>
            <TextField
              size="small"
              variant="outlined"
              placeholder="Search..."
              value={navSearchValue || ''}
              onChange={(e) => onNavSearchChange?.(e.target.value)}
              aria-label="Search movies from navbar"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchOutlinedIcon sx={{ fontSize: 18 }} color="action" />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                width: { xs: 140, sm: 200 },
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'background.paper',
                  borderRadius: '6px',
                  fontSize: '0.8125rem',
                  height: 36,
                },
              }}
            />
          </Collapse>

          <Link
            component={RouterLink}
            to="/favorites"
            sx={navLinkStyle(location.pathname === '/favorites')}
          >
            Favorites
          </Link>

          <ThemeToggle />

          {isLoggedIn ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ display: { xs: 'none', sm: 'block' }, fontWeight: 500 }}
              >
                {username}
              </Typography>
              <Tooltip title="Logout">
                <Link
                  component="button"
                  onClick={logout}
                  sx={{
                    ...navLinkStyle(false),
                    color: 'text.secondary',
                    fontSize: '0.8125rem',
                    border: 'none',
                    background: 'none',
                    padding: 0,
                  }}
                  id="logout-btn"
                >
                  Logout
                </Link>
              </Tooltip>
            </Box>
          ) : (
            <Link
              component={RouterLink}
              to="/login"
              sx={{
                ...navLinkStyle(location.pathname === '/login'),
                fontWeight: 600,
              }}
              id="nav-login-btn"
            >
              Sign In
            </Link>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
