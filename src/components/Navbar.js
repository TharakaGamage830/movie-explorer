import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isLoggedIn, username, logout } = useAuth();
  const location = useLocation();

  const linkStyle = (path) => ({
    color: location.pathname === path ? 'primary.main' : 'text.primary',
    fontWeight: location.pathname === path ? 600 : 500,
    fontSize: '0.875rem',
    textTransform: 'none',
    '&:hover': {
      color: 'primary.main',
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
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 3 } }}>
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
            }}
          >
            Movie Explorer
          </Typography>

          {isLoggedIn && (
            <>
              <Button component={RouterLink} to="/" sx={linkStyle('/')}>
                Home
              </Button>
              <Button
                component={RouterLink}
                to="/favorites"
                sx={linkStyle('/favorites')}
                startIcon={<FavoriteBorderOutlinedIcon sx={{ fontSize: 18 }} />}
              >
                Favorites
              </Button>
            </>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ThemeToggle />
          {isLoggedIn && (
            <>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ display: { xs: 'none', sm: 'block' } }}
              >
                {username}
              </Typography>
              <Tooltip title="Logout">
                <Button
                  onClick={logout}
                  size="small"
                  sx={{
                    color: 'text.secondary',
                    textTransform: 'none',
                    fontSize: '0.8125rem',
                    '&:hover': { color: 'primary.main' },
                  }}
                  id="logout-btn"
                >
                  Logout
                </Button>
              </Tooltip>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
