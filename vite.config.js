import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/ms-auth': {
        target: 'https://login.live.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ms-auth/, ''),
      },
      '/xbox-user-auth': {
        target: 'https://user.auth.xboxlive.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/xbox-user-auth/, ''),
      },
      '/xbox-xsts-auth': {
        target: 'https://xsts.auth.xboxlive.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/xbox-xsts-auth/, ''),
      },
      '/xbox-profile-api': {
        target: 'https://profile.xboxlive.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/xbox-profile-api/, ''),
      },
      '/xbox-social-api': {
        target: 'https://social.xboxlive.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/xbox-social-api/, ''),
      },
      '/xbox-titlehub-api': {
        target: 'https://titlehub.xboxlive.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/xbox-titlehub-api/, ''),
      }
    },
  },
})
