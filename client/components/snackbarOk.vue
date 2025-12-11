<template>
    <v-snackbar
        :model-value="Boolean(message)"
        timeout="4000"
        color="primary"
        variant="tonal"
        min-width="0"
        rounded="lg"
        >
        <div class="d-flex align-center">
            <v-icon icon="mdi-check-circle-outline" class="mr-2"/>
            <p>{{ message }}</p>
        </div>
    </v-snackbar>
</template>
<script setup>
    const props = defineProps({
        message: {
            type: String,
            default: ''
        }
    })
</script>

