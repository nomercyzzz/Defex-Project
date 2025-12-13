import { createApp } from 'vue'
import App from './app.vue'
import router from './router/index.js'
import { createVuetify } from 'vuetify'
import { createPinia } from 'pinia'

import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

const app = createApp(App) 
const pinia = createPinia()

const vuetify = createVuetify({
    theme: {
        defaultTheme: 'dark',
        themes: {
            dark: {
                colors: {
                    background: '#111111',
                    surface:    '#18181b',
                    primary:    '#00dc82',
                    secondary:  '#9ca3af',
                    'on-background': '#f9fafb',
                    'on-surface':    '#f9fafb',
                    'on-primary':    '#020617',
                }
            }
        }
    }
})
app.use(pinia)
app.use(router)
app.use(vuetify)
app.mount('#app')
