import { defineConfig } from 'cypress';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  e2e: {
    baseUrl: 'https://localhost:5173',
  },
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
      viteConfig: {
        plugins: [react()],
      },
    },
  },
});
