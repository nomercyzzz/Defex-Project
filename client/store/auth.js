import { defineStore } from 'pinia'
import {ref, computed } from 'vue'
import axios from 'axios'

export const useAuthStore = defineStore('auth', () => {

    const user = ref(null)
    const isLoading = ref(true)

    // вычеслемые свойства для проверки авторизации, роли и менеджера 
    const isAuthorized = computed(() => !!user.value)
    const role = computed(() => user.value?.role || 'observer')
    const isManager = computed(() => role.value === 'manager')
    const isEngineer = computed(() => role.value === 'engineer')
    
    //функция для проверки авторизации
    async function checkAuth() {
        isLoading.value = true
        try {
            const response = await axios.get('/api/check-auth')
            user.value = response.data.user
        } catch (error) {
            // если ошибка связана с авторизацией, пробуем сначала обновить асес токен
            if (error.response.status === 401) {
                try {
                    await axios.post('/api/refresh')

                    const response = await axios.get('/api/check-auth')
                    user.value = response.data.user

                } catch {
                    user.value = null
                }
            } else {
                user.value = null
            }
        } finally {
            isLoading.value = false
        }
    }

    function setUser(userData) {
        user.value = userData
    }

    return { 
        user, 
        role, 
        isManager, 
        isEngineer,
        isAuthorized, 
        isLoading,
        checkAuth,
        setUser
    }
})