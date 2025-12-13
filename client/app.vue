<template>
    <v-app>
        <div v-if="authStore.isLoading" class="d-flex justify-center align-center h-screen" style="height: 100vh;">
            <v-progress-circular indeterminate color="primary" size="64"/>
        </div>
        
        <router-view v-else />
    </v-app>
</template>
<script setup>
import { useAuthStore } from './store/auth.js'

const authStore = useAuthStore();
</script>