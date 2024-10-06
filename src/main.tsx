import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import { routes } from '@static/routes';
import { AuthProvider } from '@context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './main.css';
import { ThemeProvider } from '@mui/material';
import { THEME } from '@static/MIUItheme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PageLoading from '@pages/pageLoading';
import { DBConfig } from '@static/DBConfig';
import { initDB } from 'react-indexed-db-hook';

initDB(DBConfig);
const router = createHashRouter(routes);
const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider theme={THEME}>
          <ToastContainer position='top-center' autoClose={2000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss pauseOnHover theme='colored' />
          <RouterProvider router={router} fallbackElement={<PageLoading text='' loading={true} />} />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
