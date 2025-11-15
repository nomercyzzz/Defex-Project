import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'

export default defineConfig({
    root: 'client',
    plugins: [ vue(), vuetify({ autoImport: true })],
    server: {
        port: 3000,
        open: true,
        proxy: {
            '/api': {
                target: 'http://localhost:5000',
                // change origin нужно чтобы запрос прошел на бэкенд сервер через прокси по порту 5000
                changeOrigin: true,
                
            }
        }
    }
})
