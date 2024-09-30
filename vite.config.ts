import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: { '@api': path.resolve(__dirname, './src/api'), '@pages': path.resolve(__dirname, './src/pages'), '@components': path.resolve(__dirname, './src/components'), '@helpers': path.resolve(__dirname, './src/helpers'), '@context': path.resolve(__dirname, './src/context'), '@static': path.resolve(__dirname, './src/static'), '@assets': path.resolve(__dirname, './src/assets'), '@hooks': path.resolve(__dirname, './src/hooks') },
  },
  plugins: [react(), svgr()],
});
