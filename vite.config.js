import { defineConfig, splitVendorChunkPlugin } from 'vite'
import react from '@vitejs/plugin-react'
// import million from 'million/compiler';

export default defineConfig({
  plugins: [
    splitVendorChunkPlugin(),
    // million.vite(), 
    react()
  ]
})
