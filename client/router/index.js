import { createRouter, createWebHashHistory } from 'vue-router'

import axios from 'axios'

import login from '../views/login.vue'
import reg from '../views/registration.vue'
import home from '../views/projects.vue'
const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        { path: '/login', component: login },
        { path: '/registration', component: reg},
        { path: '/home', component: home},
        { path: '/', component: home },
        // любой непонятный машрут редиктит на главную страницу
        { path: '/:pathMatch(.*)*', redirect: '/home' },
    ]
})

const acceptablePages = ['/login', '/registration'];

router.beforeEach(async (to, from, next) => {
    if (acceptablePages.includes(to.path)) {
        return next();
    }

    try { 
        await axios.get('/api/check-auth')
        
        return next()
    } catch (error) {
        // елси ошибка не связана с авторизацией или нет ответа с сервера, кидаем на логин 
        if (!error.response || error.response.status !== 401) {
            return next('/login')
        }
        try {
            await axios.post('/api/refresh')
            await axios.get('/api/check-auth')

            return next()
        } catch {
            // если асес токен не обновился кидаем на страницу логина
            return next('/login')
        }

    }
})

export default router