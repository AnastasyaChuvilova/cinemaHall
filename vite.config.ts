import { defineConfig } from 'vite'

export default defineConfig({
    publicDir: 'public',
    base: '/cinemaHall/',
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        assetsInlineLimit: 0
    }
})