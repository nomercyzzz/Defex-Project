<template>
    <div class="login-page">
        <v-fade-transition appear>
            <div class="login-container">
                <h1 class="title">Вход в аккаунт</h1>
                <p class="subtitle">Введите данные для входа</p>
                    <v-form ref="form" @submit="onSubmit">
                        <!-- инпуты -->
                        <v-text-field
                            v-model="loginORemail"
                            :rules="loginORemailRules"
                            type="text"
                            label="Логин или Почта"
                            variant="outlined"
                            hide-details="auto"
                            class="input"
                            density="comfortable"
                            prepend-inner-icon="mdi-account-outline"
                            color="primary"
                            rounded="lg"
                            clearable
                        />
                        <v-text-field
                            v-model="password"
                            :rules="passwordRules"
                            :type="showPassword ? 'text' : 'password'"
                            label="Пароль"
                            variant="outlined"
                            hide-details="auto"
                            class="input"
                            density="comfortable"
                            prepend-inner-icon="mdi-lock-outline"
                            color="primary"
                            rounded="lg"
                            :append-inner-icon="showPassword ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
                            @click:append-inner="showPassword = !showPassword"
                        />
                        <!-- кнопка -->
                        <v-btn
                            height="44"
                            width="100%"
                            class="login-btn"
                            color="primary"
                            rounded="lg"
                            type="submit"
                            :loading="loading"
                        >Войти</v-btn>
                    </v-form>
                <!-- низ -->
                <p class="bottom-text">
                    Нет аккаунта?
                    <a class="accent-link">Зарегистрироваться</a>
                </p>
            </div>
        </v-fade-transition>
    </div>
</template>

<script setup>
import { ref } from 'vue'

// флаг для показа пароля
const showPassword = ref(false)
const form = ref(null)

// получение данных из инпутов 
const loginORemail = ref('')
const password = ref('')

// валидация
const loginORemailRules = [
    v => !!v || 'Введите логин или почту'
]
const passwordRules = [
    v => !!v || 'Введите пароль',
]
// флаг загрузки
const loading = ref(false)

const onSubmit = async (event) => {
    event.preventDefault()
    const result = await form.value.validate()
    if (!result?.valid) return

    loading.value = true
    
    try {
        console.log('форма отпр', {
        'логин или почта': loginORemail.value,
        пароль: password.value})
    } finally {
        loading.value = false
    }
}

</script>


<style scoped>
.login-page {
    height: 100vh;
    background-color: rgb(var(--v-theme-background));
    color: rgb(var(--v-theme-on-background));
    display: flex;
    justify-content: center;
    align-items: center;
}

.login-container {
    width: 100%;
    max-width: 380px;
    text-align: center;
    padding: 0 16px;
}

/* заголовок и подзаголовок */
.title {
    font-size: 32px;
    font-weight: 600;
    margin: 0;
    line-height: 1.2;
}

.subtitle {
    margin-top: 8px;
    margin-bottom: 20px;
    font-size: 16px;
    color: rgb(var(--v-theme-secondary));
    line-height: 1.4;
}
/* инпут */

.input :deep(.v-icon) {
    opacity: 0.8;
}
.input{
    margin-top: 12px;
}

.login-btn {
    font-size: 16px;
    margin-top: 18px;
    font-weight: 600;
    text-transform: none;
    letter-spacing: 0.32px;
}

/* низ */
.bottom-text {
    margin-top: 14px;
    font-size: 16px;
    color: rgb(var(--v-theme-secondary));
}

.accent-link {
    margin-left: 4px;
    color: rgb(var(--v-theme-primary));
    text-decoration: none;
    position: relative;
    display: inline-block;
    padding-bottom: 2px;
    cursor: pointer;
}

.accent-link::after {
    content: "";
    position: absolute;
    left: 50%;
    bottom: 0;
    width: 100%;
    height: 2px;
    background-color: rgb(var(--v-theme-primary));
    transform: translateX(-50%) scaleX(0);
    transform-origin: center;
    transition: transform 0.4s ease;
}

.accent-link:hover::after {
    transform: translateX(-50%) scaleX(1);
}

:deep(.v-btn) {
    transition: transform 0.4s ease-out;
}
:deep(.v-btn:active) {
    transform: scale(0.94);
}
</style>
