import React, { useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
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
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import WhatshotOutlinedIcon from '@mui/icons-material/WhatshotOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ showNavSearch, navSearchValue, onNavSearchChange }) => {
  const { isLoggedIn, username, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleNavigate = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

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

  const navItems = [
    { label: 'Home', path: '/', icon: <HomeOutlinedIcon /> },
    { label: 'Trending Movies', path: '/trending', icon: <TrendingUpOutlinedIcon /> },
    { label: 'Popular Movies', path: '/popular', icon: <WhatshotOutlinedIcon /> },
    { label: 'Favorites', path: '/favorites', icon: <FavoriteBorderOutlinedIcon /> },
  ];

  return (
    <>
      <AppBar position="sticky" component="nav" aria-label="Main navigation" sx={{ zIndex: 1100 }}>
        <Toolbar
          sx={{
            justifyContent: 'space-between',
            maxWidth: 1280,
            width: '100%',
            mx: 'auto',
            px: { xs: 1.5, sm: 3 },
            minHeight: { xs: '56px', sm: '64px' },
          }}
        >
          {/* Left Side: Hamburger (mobile) + Brand + Desktop Navigation Links */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2.5 } }}>
            {/* Mobile Hamburger Button */}
            <IconButton
              color="inherit"
              aria-label="open navigation menu"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ display: { xs: 'inline-flex', md: 'none' }, p: 0.75 }}
            >
              <MenuIcon />
            </IconButton>

            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{
                color: 'primary.main',
                fontWeight: 800,
                textDecoration: 'none',
                textTransform: 'uppercase',
                fontSize: { xs: '0.85rem', sm: '1.1rem' },
                letterSpacing: '0.04em',
                whiteSpace: 'nowrap',
              }}
            >
              Movie Explorer
            </Typography>

            {/* Desktop Navigation Links */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2.5, ml: 1 }}>
              <Link component={RouterLink} to="/" sx={navLinkStyle(location.pathname === '/')}>
                Home
              </Link>
              <Link component={RouterLink} to="/trending" sx={navLinkStyle(location.pathname === '/trending')}>
                Trending Movies
              </Link>
              <Link component={RouterLink} to="/popular" sx={navLinkStyle(location.pathname === '/popular')}>
                Popular Movies
              </Link>
            </Box>
          </Box>

          {/* Right Side: Sticky Search, Favorites, Theme Toggle, User/Auth */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
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
                        <SearchOutlinedIcon sx={{ fontSize: 16 }} color="action" />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  width: { xs: 110, sm: 160, md: 200 },
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'background.paper',
                    borderRadius: '6px',
                    fontSize: '0.8125rem',
                    height: 34,
                  },
                }}
              />
            </Collapse>

            {/* Desktop Favorites Link */}
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Link component={RouterLink} to="/favorites" sx={navLinkStyle(location.pathname === '/favorites')}>
                Favorites
              </Link>
            </Box>

            <ThemeToggle />

            {/* Desktop Auth */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1.5 }}>
              {isLoggedIn ? (
                <>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
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
                </>
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
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Navigation Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
            backgroundColor: 'background.paper',
            backgroundImage: 'none',
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 800, fontSize: '1rem', letterSpacing: '0.04em' }}>
            MOVIE EXPLORER
          </Typography>
          <IconButton onClick={handleDrawerToggle} size="small" aria-label="Close menu">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        <Divider />

        {/* Navigation List */}
        <List sx={{ px: 1, py: 1.5 }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => handleNavigate(item.path)}
                  sx={{
                    borderRadius: 1.5,
                    backgroundColor: isActive ? 'action.selected' : 'transparent',
                    color: isActive ? 'primary.main' : 'text.primary',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: isActive ? 'primary.main' : 'text.secondary', minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: isActive ? 600 : 500,
                      fontSize: '0.9rem',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        <Divider />

        {/* User Account / Auth Section */}
        <Box sx={{ p: 2, mt: 'auto' }}>
          {isLoggedIn ? (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                <AccountCircleOutlinedIcon color="primary" />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {username}
                </Typography>
              </Box>
              <ListItemButton
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                }}
                sx={{
                  borderRadius: 1.5,
                  color: 'error.main',
                  py: 1,
                  px: 1.5,
                }}
              >
                <ListItemIcon sx={{ color: 'error.main', minWidth: 36 }}>
                  <LogoutOutlinedIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Log Out" primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 600 }} />
              </ListItemButton>
            </Box>
          ) : (
            <ListItemButton
              onClick={() => handleNavigate('/login')}
              sx={{
                borderRadius: 1.5,
                backgroundColor: 'primary.main',
                color: '#FFFFFF',
                py: 1.2,
                justifyContent: 'center',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              }}
            >
              <ListItemIcon sx={{ color: '#FFFFFF', minWidth: 32 }}>
                <LoginOutlinedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="Sign In"
                primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 600, textAlign: 'center' }}
              />
            </ListItemButton>
          )}
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
