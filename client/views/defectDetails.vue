<template>
    <div class="details-page">
        <transition name="fade" mode="out-in">
            <div 
                v-if="loading" 
                key="loader"
                class="d-flex justify-center align-center w-100" 
                style="height: 100vh; position: fixed;"
            >
                <v-progress-circular indeterminate color="primary" size="64" />
            </div>

            <div v-else key="content" class="details-wrapper">

                <SnackbarOk :message="snackbarOk" />
                <SnackbarError :message="snackbarError" />

                <header>
                    <div>
                        <h1 class="header-title"> 
                            Детали дефекта · {{ defect.id}}
                        </h1>
                    </div>
                    <div>
                        <v-btn
                            size="large"
                            variant="tonal"
                            color="primary"
                            prepend-icon="mdi-arrow-left"
                            rounded="lg"
                            @click="$router.push(`/projects/${defect.projectCode}/defects`)"
                        > К дефектам </v-btn>
                    </div>
                </header>

                <main>
                    <section class="section-card section-comments">
                        <h2 class="section-title"> Комментарии </h2>
                            
                        <div class="comments-body" ref="commentsBox">
                            <div v-if="defect.comments && defect.comments.length" class="comments-list">
                                <div v-for="c in defect.comments" :key="c.id" class="comment-item" :class="{ 'comment-item--mine': c.author === authStore.user?.login }">
                                    <div class="comment-header">
                                        <span class="comment-author">{{ c.author }}</span>
                                        <span class="comment-date">{{ c.date }}</span>
                                    </div>
                                    <p class="comment-text">{{ c.text }}</p>
                                </div>
                            </div>
                            <p v-else class="empty-text">Комментариев пока нет.</p>
                        </div>

                        <v-divider class="section-divider" />

                        <div v-if="canEdit" class="comment-form">
                            <v-textarea
                                v-model="newComment"
                                variant="outlined"
                                density="comfortable"
                                rows="3"
                                rounded="lg"
                                color="primary"
                                hide-details
                                label="Написать комментарий..."
                                :loading="commentSending"
                            />
                            <v-btn
                                color="primary"
                                rounded="lg"
                                height="40"
                                :disabled="!newComment.trim()"
                                :loading="commentSending"
                                @click="addComment"
                                > Отправить
                            </v-btn>
                        </div>
                        <div v-else class="pa-4 text-center text-medium-emphasis bg-surface-lighten-1 rounded-lg">
                            <v-icon icon="mdi-eye-outline" class="mb-1"/>
                            <p style="font-size: 13px;">Только просмотр</p>
                        </div>
                    </section>
                    
                    <div class="right-column">
                        
                        <section class="section-card right-card">
                            <h2 class="section-title">Вложения</h2>
                            
                            <div class="scroll-container">
                                <div v-if="defect.attachments && defect.attachments.length" class="files-list">
                                    <div v-for="file in defect.attachments" :key="file.id" class="file-item">
                                        <div class="file-main">
                                            <v-icon :icon="fileIcon(file.type)" size="24" color="primary" />
                                            <div style="overflow: hidden;">
                                                <p class="file-name text-truncate">{{ file.name }}</p>
                                                <p class="file-meta">{{ file.size }}</p>
                                            </div>
                                        </div>
                                        <v-btn variant="text" icon="mdi-download" size="small" color="secondary" />
                                    </div>
                                </div>
                                <p v-else class="empty-text">Нет файлов</p>
                            </div>

                            <div v-if="canEdit" class="files-form mt-2 pt-2" style="border-top: 1px solid rgba(255,255,255,0.05)">
                                <v-file-input
                                    v-model="newFiles"
                                    variant="outlined"
                                    density="comfortable"
                                    rounded="lg"
                                    color="primary"
                                    hide-details
                                    prepend-icon=""
                                    prepend-inner-icon="mdi-paperclip"
                                    label="Добавить файлы"
                                    multiple
                                    show-size
                                />
                                <v-btn
                                    class="mt-2"
                                    color="primary"
                                    rounded="lg"
                                    height="40"
                                    block
                                    :disabled="!newFiles.length"
                                    :loading="filesSending"
                                    @click="uploadFiles"
                                >
                                    Загрузить
                                </v-btn>
                            </div>
                        </section>

                        <section class="section-card right-card">
                            <h2 class="section-title">История</h2>
                            <div class="scroll-container">
                                <v-timeline v-if="defect.history && defect.history.length" side="end" density="compact" class="history-timeline" truncate-line="start">
                                    <v-timeline-item
                                        v-for="item in defect.history"
                                        :key="item.id"
                                        dot-color="primary"
                                        size="x-small"
                                    >
                                        <template #opposite>
                                            <span class="history-meta">{{ item.date }}</span>
                                        </template>
                                        <p class="history-action">{{ item.action }}</p>
                                        <p class="history-meta">{{ item.author }}</p>
                                    </v-timeline-item>
                                </v-timeline>
                                <p v-else class="empty-text">История пуста.</p>
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { ref, onMounted, computed} from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../store/auth.js'
import axios from 'axios'
import SnackbarOk from '../components/snackbarOk.vue'
import SnackbarError from '../components/snackbarError.vue'


const loading = ref(true);
const route = useRoute();
const authStore = useAuthStore();

const defect = ref({});

const snackbarOk = ref('');
const snackbarError = ref('');

const showSuccess = (msg) => {
    snackbarOk.value = msg
    setTimeout(() => snackbarOk.value = '', 4000)
}
const showError = (msg) => {
    snackbarError.value = msg
    setTimeout(() => snackbarError.value = '', 4000)
}

const canEdit = computed(() => ['manager', 'engineer'].includes(authStore.user.role))

onMounted(async () => { 
    try {
        const id = route.params.id
        const response = await axios.get(`/api/defects/${id}`)

        loading.value = false;
        defect.value = response.data
    } catch (error) { 
        loading.value = false;
    } 
})

const newComment = ref('');

const commentSending = ref(false)
const addComment = async () => {
    if (!newComment.value.trim()) return
    commentSending.value = true
    try {
        const response = await axios.post(`/api/defects/${defect.value.id}/comments`, { text: newComment.value })
        if (!defect.value.comments) defect.value.comments = []

        defect.value.comments.push(response.data.comment)
        defect.value.history.push(response.data.history)

        newComment.value = ''
        
        showSuccess.value = 'Комментарий успешно добавлен'
        commentSending.value = false

    } catch (error) { 
        showError('Ошибка дабавления комментария')
        commentSending.value = false 
    }
}

const newFiles = ref([]);

const filesSending = ref(false)
const uploadFiles = async () => {
    if (!newFiles.value.length) return
    filesSending.value = true
    const filesPayload = newFiles.value.map(file => ({
        name: file.name,
        size: formatSize(file.size),
        type: getFileType(file.name)
    }))
    try {
        const response = await axios.post(`/api/defects/${defect.value.id}/files`, { files: filesPayload })
        if (response.data.attachments) {
            if (!defect.value.attachments) defect.value.attachments = []
            defect.value.attachments.push(...response.data.attachments)
            defect.value.history.push(response.data.history)
        }
        newFiles.value = []
        filesSending.value = false

        showSuccess('Файл успешно добавлен')
        
    } catch (error) {
        showError('Ошибка загрузки файлов') 
    } 
}


const getFileType = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase()

    if (['jpg', 'jpeg', 'png', 'webp'].includes(ext)) return 'image'
    if (['pdf'].includes(ext)) return 'pdf'
    if (['doc', 'docx'].includes(ext)) return 'word'
    if (['xls', 'xlsx'].includes(ext)) return 'excel'

    return 'file'
}
const formatSize = (bytes) => {
    if (bytes === 0) return '0 B'
    const k = 1024

    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}
const fileIcon = (type) => {
    const map = { 
        'image': 'mdi-file-image', 
        'pdf': 'mdi-file-pdf-box', 
        'word': 'mdi-file-word', 
        'excel': 'mdi-file-excel', 
        'file': 
        'mdi-file' 
    }

    return map[type] || 'mdi-file'
}
</script>

<style scoped>

.details-page {
    height: 100vh; 
    background-color: rgb(var(--v-theme-background));
    color: rgb(var(--v-theme-on-background));
    display: flex;
    justify-content: center;
    padding: 24px 16px; 
    overflow: hidden; 
}

.details-wrapper {
    width: 100%;
    height: 100%;
    max-width: 1400px;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

header {
    flex-shrink: 0; 
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    padding: 20px 16px;
    border-radius: 14px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    background-color: rgba(var(--v-theme-surface), 0.9);
}

.header-title {
    line-height: 1.2;
    font-weight: 700;
}

main {
    flex: 1; 
    display: flex;
    gap: 16px;
    align-items: stretch;
    overflow: hidden; 
    padding-bottom: 2px;
}


.section-comments {
    flex: 1; 
    display: flex;
    flex-direction: column;
    height: 100%;
}


.right-column {
    width: 420px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    height: 100%;
    overflow: hidden;
}


.section-card {
    padding: 16px;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    background-color: rgba(var(--v-theme-surface), 0.9);
    display: flex;
    flex-direction: column;
    gap: 10px;
}


.right-card {
    flex: 1;
    min-height: 0; 
}

.section-title {
    font-size: 20px;
    font-weight: 600;
    flex-shrink: 0;
}

.section-divider {
    margin: 8px 0;
    flex-shrink: 0;
}

.empty-text {
    font-size: 14px;
    color: rgb(var(--v-theme-secondary));
    text-align: center;
    padding: 24px 0;
}




.comments-body {
    flex: 1; 
    overflow-y: auto; 
    padding-right: 6px;
}

.comments-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.scroll-container {
    flex: 1;
    overflow-y: auto;
    padding-right: 4px;
    min-height: 0;
}

.comment-item {
    padding: 12px 14px;
    border-radius: 12px;
    background-color: rgba(255, 255, 255, 0.03);
    border: 1px solid transparent;
}
.comment-item--mine {
    background-color: rgba(var(--v-theme-primary), 0.05);
    border-color: rgba(var(--v-theme-primary), 0.15);
}
.comment-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 6px;
}
.comment-author {
    color: rgb(var(--v-theme-secondary));
    font-size: 12px;
    font-weight: 600;
}
.comment-date {
    font-size: 11px;
    color: rgb(var(--v-theme-secondary));
    opacity: 0.7;
}
.comment-text {
    font-size: 15px;
    line-height: 1.5;
    white-space: pre-wrap;
}

.comment-form {
    flex-shrink: 0; 
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.files-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.file-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 12px;
    background-color: rgba(255, 255, 255, 0.03);
    border-radius: 10px;
    transition: background-color 0.2s;
}
.file-item:hover {
    background-color: rgba(255, 255, 255, 0.06);
}
.file-main {
    display: flex;
    align-items: center;
    gap: 12px;
    overflow: hidden;
    max-width: 85%;
}
.file-name {
    font-size: 14px;
    font-weight: 500;
}
.file-meta {
    font-size: 11px;
    color: rgb(var(--v-theme-secondary));
}

.history-action {
    font-size: 13px;
    line-height: 1.3;
}
.history-meta {
    font-size: 11px;
    color: rgb(var(--v-theme-secondary));
    margin-top: 2px;
}

.bg-surface-lighten-1 {
    background-color: rgba(255,255,255,0.05);
}

/* общие стили для кнопок  */
:deep(.v-btn) {
    transition: all 0.4s ease-out;
}
:deep(.v-btn:active) {
    transform: scale(0.94);
}

/* анимация при появлении страницы */
.fade-enter-active,
.fade-leave-active {
    transition: all 0.4s ease-out; 
}

.fade-enter-from {
    opacity: 0;
    transform: translateY(30px) scale(0.98); 
}

.fade-leave-to {
    opacity: 0;
    transform: scale(0.95); 
}

/* адаптив */
@media (max-width: 1000px) {
    .details-page {
        height: auto;
        overflow: auto;
        display: block;
        padding-bottom: 40px;
    }
    .details-wrapper {
        height: auto;
    }
    main {
        flex-direction: column;
        overflow: visible;
    }
    .right-column {
        width: 100%;
        flex-direction: row;
        flex-wrap: wrap;
        height: auto;
    }
    .section-comments {
        height: 600px; 
    }
    .right-column > section {
        flex: 1;
        min-width: 300px;
        height: 400px;
    }
}

@media (max-width: 600px) {
    .details-page {
        padding: 16px 8px;
    }
    header {
        flex-direction: column;
        align-items: stretch;
    }
    .header-title {
        font-size: 20px;
    }
    .right-column {
        flex-direction: column;
    }
    .section-comments, .right-column > section {
        height: auto;
        max-height: 500px;
    }
}
</style>