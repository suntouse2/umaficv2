import { createTheme } from '@mui/material';

export const THEME = createTheme({
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          maxWidth: '400px',
          marginTop: '0px !important',
          backgroundColor: '#fff', // Цвет фона
          color: 'black', // Цвет текста
          fontSize: '0.75rem', // Размер шрифта
          borderRadius: '4px', // Радиус границ
          padding: '16px', // Отступы
          boxShadow: '0 1px 5px #0003, 0 2px 2px #00000024, 0 3px 1px -2px #0000001f',
        },
      },
    },
  },
  typography: {
    fontFamily: `"Mulish","Roboto", "Helvetica", "Arial", sans-serif`,
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    button: {
      textTransform: 'none',
    },
  },
  palette: {
    primary: {
      main: '#568ce1',
    },
    secondary: {
      main: '#26a69a',
    },
    error: {
      main: '#c10015',
    },
    warning: {
      main: '#f2c037',
    },
  },
});
