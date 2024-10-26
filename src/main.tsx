import { Suspense } from 'react';
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
import PageGate from '@pages/pageGate';
import { DBConfig } from '@static/DBConfig';
import { initDB } from 'react-indexed-db-hook';

initDB(DBConfig);
const router = createHashRouter(routes);
const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider theme={THEME}>
        <ToastContainer position='top-center' autoClose={2000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss pauseOnHover theme='colored' />
        <Suspense fallback={<PageGate text='' loading={true} />}>
          <RouterProvider router={router} />
        </Suspense>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);
