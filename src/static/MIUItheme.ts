import { createTheme } from '@mui/material'

export const THEME = createTheme({
	components: {
		MuiPaper: {
			styleOverrides: {
				root: {
					boxShadow:
						'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px',
				},
			},
		},
		MuiInputLabel: {
			styleOverrides: {
				root: {
					color: 'black',
				},
			},
		},
		MuiDialog: {
			styleOverrides: {},
		},
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
		MuiTab: {
			styleOverrides: {
				root: {
					color: '#666666',
					textTransform: 'none',
					fontSize: '14px',
					transition: 'color 0.3s ease, scale 0.3s ease',

					'&.Mui-selected': {
						color: 'primary',
					},
					'&.Mui-disabled': {
						color: '#b0b0b0',
					},
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
	breakpoints: {
		values: {
			xs: 0,
			sm: 540,
			md: 668,
			lg: 960,
			xl: 1280,
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
			main: '#d6152c',
		},
		success: {
			main: '#47a42b',
		},
		warning: {
			main: '#f2c037',
		},
	},
})
