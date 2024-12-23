/** @type {import('tailwindcss').Config} */

export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	darkMode: 'class',
	theme: {
		colors: {
			backdrop: 'rgb(0,0,0,0.3)',
			border: 'rgba(0, 0, 0, 0.12)',
			primary: '#568ce1',
			secondary: '#26a69a',
			secondaryHigh: '#2CCAA1',
			accent: '#d140ea',
			success: '#47a42b',
			positive: '#22ce36',
			negative: '#d6152c',
			info: '#31ccec',
			warning: '#c29a2f',
			white: '#fff',
			bg: '#fafafa',
			dark: '#1a1919',
			inputbg: '#f2f3f7cc',
			softgray: '#eeeeee',
			softgray3: '#9e9e9e',
			softgray4: '#494949',
		},
		screens: {
			xs: '0px',
			sm: '540px',
			md: '668px',
			lg: '960px',
			xl: '1280px',
			'2xl': '1536px',
		},
		extend: {
			fontSize: {
				xs: '0.75rem', // 12px
				sm: '0.875rem', // 14px
				base: '1rem', // 16px
				lg: '1.125rem', // 18px
				xl: '1.25rem', // 20px
				'2xl': '1.5rem', // 24px
				'3xl': '1.875rem', // 30px
				'4xl': '2.25rem', // 36px
				'5xl': '3rem', // 48px
				'6xl': '3.75rem', // 60px
				'7xl': '4.5rem', // 72px
				'8xl': '6rem', // 96px
				'9xl': '8rem', // 128px
			},
			height: {
				'calc-auto': "calc-size('auto')",
			},
			gridTemplateColumns: {
				'auto-fill-300': 'repeat(auto-fill, minmax(300px, 1fr))',
				'auto-fit-300': 'repeat(auto-fit, minmax(300px, 1fr))',
				'auto-fill-450': 'repeat(auto-fill, minmax(450px, 1fr))',
				'auto-fit-450': 'repeat(auto-fit, minmax(450px, 1fr))',
			},
		},
	},
	plugins: [],
}
