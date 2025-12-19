<template>

    <v-btn
        color="primary"
        variant="tonal"
        rounded="lg"
        size="large"
        prepend-icon="mdi-account-circle-outline"
        class="profile-btn"
    > Профиль

        <v-menu 
            activator="parent" 
            location="bottom center"
            offset="8"
            transition="slide-y-transition"
            :close-on-content-click="false"
        >
            <v-card rounded="xl" class="user-menu-card pt-4 pb-2">
                
                <div class="d-flex flex-column align-center px-3 mb-3">
                    <v-avatar color="primary" variant="tonal" size="56" class="mb-3">
                        <span class="text-h6 font-weight-bold text-primary">
                            {{ userInitials }}
                        </span>
                    </v-avatar>
                    
                    <h3 class="user-login text-truncate">{{ authStore.user.login || 'User' }}</h3>

                    <v-chip
                        size="large"
                        variant="tonal"
                        color="primary"
                        class="mt-2 role-chip"
                    >
                        {{ formatRole(authStore.user.role) }}
                    </v-chip>
                </div>

                <v-divider class="menu-divider mb-2" />

                <div class="px-2">
                    <v-btn
                        block
                        height="40"
                        variant="text"
                        color="secondary" 
                        class="logout-btn"
                        rounded="lg"
                        :loading="loading"
                        prepend-icon="mdi-logout"
                        @click="logout"
                    >
                        Выйти
                    </v-btn>
                </div>
            </v-card>
        </v-menu>
    </v-btn>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth.js'

import axios from 'axios'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)
const snackbarError = ref('')
const snackbarOk = ref('')

const clearErrorSnackbar = () => {
    setTimeout(() => {
        snackbarError.value = ''
    }, 4000)
}
const clearOkSnackbar = () => {
    setTimeout(() => {
        snackbarOk.value = ''
    }, 4000)
}

const userInitials = computed(() => {
    const login = authStore.user?.login || 'U'
    return login.charAt(0).toUpperCase()
})

const formatRole = (role) => {
    const roles = {
        'manager': 'Менеджер',
        'engineer': 'Инженер',
        'observer': 'Наблюдатель',
        'admin': 'Админ'
    }
    return roles[role] || role
}

const logout = async () => {
    loading.value = true
    try {
        const response = await axios.post('/api/logout');
        authStore.user.value = null;

        snackbarOk.value = response.data.value;
        loading.value = false;

        router.push('/login')

        clearOkSnackbar()
    } catch (error) {
        snackbarError.value = error.response.data.value;

        loading.value = false;

        router.push('/login');

        clearErrorSnackbar()
    } finally {
    }
}
</script>

<style scoped>
.user-menu-card {
    background-color: rgb(var(--v-theme-surface)) !important;
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 4px 20px rgba(0,0,0,0.4) !important;
}

.user-login {
    font-size: 16px;
    font-weight: 700;
    color: rgb(var(--v-theme-on-surface));
    max-width: 100%;
}

.role-chip {
    font-weight: 500;
    letter-spacing: 0.5px;
    text-transform: none;
    font-size: 14px;
    height: 22px;
    border-color: rgba(var(--v-theme-primary), 0.3) !important;
}

.menu-divider {
    border-color: rgba(255, 255, 255, 0.2);
}

.logout-btn {
    font-size: 14px;
    font-weight: 600;
    opacity: 0.8;
    text-transform: none;
    letter-spacing: 0.2px;
}

.logout-btn:hover {
    background-color: rgba(255, 255, 255, 0.05); 
    opacity: 1;
}
</style>