import { createApp } from 'vue'
import App from '../components/registration.vue'
import { createVuetify } from 'vuetify'

import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

const app = createApp(App)

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

app.use(vuetify)
app.mount('#app')
