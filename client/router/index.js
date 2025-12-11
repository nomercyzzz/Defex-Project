import { createRouter, createWebHashHistory } from 'vue-router'

import login from '../views/login.vue'
import reg from '../views/registration.vue'
import home from '../views/projects.vue'
const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        { path: '/login', component: login },
        { path: '/registration', component: reg},
        { path: '/home', component: home}
    ]
})

export default router