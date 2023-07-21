import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    server: {
      https: {
        key: env.PRIVATE_DEV_KEY,
        cert: env.PRIVATE_DEV_CERT,
      },
    },
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
      }),
    ],
  };
});
