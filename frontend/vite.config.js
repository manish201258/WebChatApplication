// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Allow access from local network
    port: 5173, // Specify the port (default is 5173)
    open: true, // Automatically open the app in the browser
    proxy: {
      '/api': 'http://localhost:3000', // Proxy API requests to your backend
    },
  },
})
