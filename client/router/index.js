import { createRouter, createWebHashHistory } from 'vue-router'

import { useAuthStore } from '../store/auth.js'

import login from '../views/login.vue'
import reg from '../views/registration.vue'
import home from '../views/projects.vue'
import defects from '../views/defects.vue'
import report from '../views/report.vue'
import defectDetails from '../views/defectDetails.vue'
const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        { path: '/login', component: login },
        { path: '/registration', component: reg},
        { path: '/home', component: home},
        { path: '/projects/:code/defects', component: defects },
        { path: '/defects/:id', component: defectDetails },
        { path: '/report', component: report},
        { path: '/', component: home },
        // любой непонятный машрут редиктит на главную страницу
        { path: '/:pathMatch(.*)*', redirect: '/home' },
    ]
})

const acceptablePages = ['/login', '/registration'];

router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();

    if (acceptablePages.includes(to.path)) {
        authStore.isLoading = false;
        return next();
    }
    
    // если не авторизован, запускам проверку авторизации
    await authStore.checkAuth();

    if (authStore.isAuthorized) {
        return next();
    } else return next('/login');
})

export default router