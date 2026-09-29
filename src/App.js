import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Box from '@mui/material/Box';
import { ThemeContextProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { MovieProvider } from './context/MovieContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <ThemeContextProvider>
        <AuthProvider>
          <MovieProvider>
            <Box
              sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'background.default',
                color: 'text.primary',
              }}
            >
              <Navbar />
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <AppRoutes />
              </Box>
              <Footer />
            </Box>
          </MovieProvider>
        </AuthProvider>
      </ThemeContextProvider>
    </BrowserRouter>
  );
}

export default App;
