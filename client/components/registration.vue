<template>
    <div class="register-page">
        <v-fade-transition appear>
            <div class="register-container">
                <h1 class="title">Регистрация</h1>
                <p class="subtitle">Создайте аккаунт для работы в системе</p>
                <v-form ref="form" @submit="onSubmit">
                    <!-- инпуты -->
                    <v-text-field
                        v-model="login"
                        type="text"
                        :rules="loginRules"
                        label="Логин"
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
                        v-model="email"
                        type="email"
                        :rules="emailRules"
                        label="Почта"
                        variant="outlined"
                        hide-details="auto"
                        class="input"
                        density="comfortable"
                        prepend-inner-icon="mdi-email-outline"
                        color="primary"
                        rounded="lg"
                        clearable
                    />
                    <v-text-field
                        v-model="password"
                        :rules="passwordRules"
                        :type="showPassword ? 'text' : 'password'"
                        :append-inner-icon="showPassword ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
                        @click:append-inner="showPassword = !showPassword"
                        label="Пароль"
                        variant="outlined"
                        hide-details="auto"
                        class="input"
                        density="comfortable"
                        prepend-inner-icon="mdi-lock-outline"
                        color="primary"
                        rounded="lg"
                    />
                    <v-select
                        v-model="role"
                        :rules="roleRules"
                        label="Роль в системе"
                        variant="outlined"
                        hide-details="auto"
                        class="input"
                        density="comfortable"
                        color="primary"
                        prepend-inner-icon="mdi-account-badge-outline"
                        rounded="lg"
                        :items="[
                            { title: 'Инженер', value: 'engineer' },
                            { title: 'Менеджер', value: 'manager' },
                            { title: 'Наблюдатель', value: 'observer' }
                        ]"
                        clearable
                    />
                    <!-- кнопка -->
                    <v-btn
                        height="44"
                        width="100%"
                        class="register-btn"
                        color="primary"
                        rounded="lg"
                        type="submit"
                        :loading="loading"
                    >Создать аккаунт</v-btn>
                    <!-- низ -->
                    <p class="bottom-text">
                        Уже есть аккаунт?
                        <a class="accent-link">Войти</a>
                    </p>
                </v-form>
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
const login = ref('')
const email = ref('')
const password = ref('')
const role = ref(null)

// валидация
const loginRules = [
    v => !!v || 'Введите логин',
    v => v.length >= 6 || 'Минимум 6 символов',
    v => v.length <= 30 || 'Максимум 30 символов',
    v => /^[a-zA-Z][a-zA-Z0-9._-]*$/.test(v) || 'Логин: латинские буквы, цифры и ._- , начинается с буквы'
]
const emailRules = [
    v => !!v || 'Введите почту',
    v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Некорректный email'
]
const passwordRules = [
    v => !!v || 'Введите пароль',
    v => v.length >= 8 || 'Минимум 8 символов',
    v =>/^[A-Za-z0-9!@#$%^&*(),.?":{}|<>_\-+=/\\[\];'`~]+$/.test(v) || 'Разрешены только латинские буквы, цифры и спецсимволы',
    v => /[A-Z]/.test(v) || 'Нужна хотя бы одна заглавная буква',
    v => /[a-z]/.test(v) || 'Нужна хотя бы одна строчная буква',
    v => /[!@#$%^&*(),.?":{}|<>_\-+=/\\[\];'`~]/.test(v) || 'Нужен хотя бы один спецсимвол',
    v => !/\s/.test(v) || 'Пароль не должен содержать пробелы'
]
const roleRules = [
    v => !!v || 'Выберите роль в системе'
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
        логин: login.value,
        почта: email.value,
        роль: role.value,
        пароль: password.value})
    } finally {
        loading.value = false
    }
}

</script>

<style scoped>
.register-page {
    height: 100vh;
    background-color: rgb(var(--v-theme-background));
    color: rgb(var(--v-theme-on-background));
    display: flex;
    justify-content: center;
    align-items: center;
}

.register-container {
    width: 100%;
    max-width: 380px;
    text-align: center;
    padding: 0 16px;
}

/* заголовок и подзаголовок*/
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

/* инпут*/
.input {
    margin-top: 12px;
}

.input :deep(.v-icon) {
    opacity: 0.8;
}

/* кнопка */
.register-btn {
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
