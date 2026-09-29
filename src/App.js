import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Box from '@mui/material/Box';
import { ThemeContextProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { MovieProvider } from './context/MovieContext';
import { NavSearchProvider, useNavSearch } from './context/NavSearchContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AppRoutes from './routes/AppRoutes';

const AppLayout = () => {
  const { showNavSearch, navSearchValue, updateNavSearch } = useNavSearch();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.default',
        color: 'text.primary',
      }}
    >
      <Navbar
        showNavSearch={showNavSearch}
        navSearchValue={navSearchValue}
        onNavSearchChange={updateNavSearch}
      />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <AppRoutes />
      </Box>
      <Footer />
    </Box>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ThemeContextProvider>
        <AuthProvider>
          <MovieProvider>
            <NavSearchProvider>
              <AppLayout />
            </NavSearchProvider>
          </MovieProvider>
        </AuthProvider>
      </ThemeContextProvider>
    </BrowserRouter>
  );
}

export default App;
