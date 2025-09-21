import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { generatePostsPlugin } from './vite-plugin-posts.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), generatePostsPlugin(), viteSingleFile()],
})
