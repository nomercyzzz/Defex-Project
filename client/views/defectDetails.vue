<template>
    <div class="details-page">
        <div class="details-wrapper">
            <header>
                <div>
                    <h1 class="header-title"> 
                        Комментарии, вложения и история · DF-001
                    </h1>
                </div>
                
                <div>
                    <v-btn
                        size="large"
                        variant="tonal"
                        color="primary"
                        prepend-icon="mdi-arrow-left"
                        rounded="lg"
                    > К дефектам </v-btn>
                </div>
            </header>

            <main>
                <section class="section-card section-comments">
                    <h2 class="section-title"> Комментарии </h2>
                        <div class="comments-body">
                            <div v-if="comments.length" class="comments-list">
                                <div v-for="c in comments" :key="c.id" class="comment-item" :class="{ 'comment-item--mine': c.author === 'Вы' }">
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

                        <div class="comment-form">
                            <v-textarea
                                v-model="newComment"
                                variant="outlined"
                                density="comfortable"
                                rows="4"
                                rounded="lg"
                                color="primary"
                                hide-details
                                label="Новый комментарий"
                            />
                            <v-btn
                                color="primary"
                                rounded="lg"
                                height="40"
                                :disabled="!newComment.trim()"
                                @click="addComment"
                                > Добавить
                            </v-btn>
                        </div>
                </section>
                
                <div class="right-column">
                    <section class="section-card">
                        <h2 class="section-title">Вложения</h2>
                            <div v-if="attachments.length" class="files-list">
                                <div v-for="file in attachments" :key="file.id" class="file-item">
                                    <div class="file-main">
                                        <v-icon :icon="fileIcon(file.type)" size="22" color="primary" />
                                            <div>
                                                <p class="file-name">{{ file.name }}</p>
                                            <p class="file-meta">{{ file.size }}</p>
                                        </div>
                                    </div>

                                    <v-btn
                                        variant="text"
                                        color="primary"
                                        rounded="lg"
                                        height="32"
                                    >Открыть </v-btn>
                                </div>
                            </div>

                            <p v-else class="empty-text">Вложений пока нет.</p>

                            <div class="files-form">
                                <v-file-input
                                    v-model="newFiles"
                                    variant="outlined"
                                    density="comfortable"
                                    rounded="lg"
                                    color="primary"
                                    hide-details
                                    prepend-icon="mdi-paperclip"
                                    label="Добавить файлы"
                                    show-size
                                />
                                <v-btn
                                    color="primary"
                                    rounded="lg"
                                    height="40"
                                    :disabled="!newFiles || !newFiles.length"
                                    @click="uploadFiles"
                                >
                                    Загрузить
                                </v-btn>
                            </div>
                    </section>

                    <section class="section-card section-history">
                        <h2 class="section-title">История</h2>
                            <v-timeline v-if="history.length" side="end">
                                <v-timeline-item
                                    v-for="item in history"
                                    :key="item.id"
                                    dot-color="primary"
                                    size="small"
                                    >
                                        <template #opposite>
                                            <span class="history-meta">{{ item.date }}</span>
                                        </template>
                                        <p class="history-action">{{ item.action }}</p>
                                    <p class="history-meta">{{ item.author }}</p>
                                </v-timeline-item>
                            </v-timeline>
                        <p v-else class="empty-text">История пока пустая.</p>
                    </section>
                </div>
            </main>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

// комментарии
const comments = ref([
    {
        id: 11,
        author: 'Инженер технадзора',
        date: '05.11.2025', 
        text: 'Дефект зафиксирован, требуеться ремонт' 
    },
    { 
        id: 12,
        author: 'Мастер участка', 
        date: '06.11.2025', 
        text: 'Назначена бригада, работы начнуться завтра' 
    }
])

const newComment = ref('')
const addComment = () => {
    const text = newComment.value.trim()
    if (!text) return

    comments.value.push({
        id: Date.now(),
        author: 'Вы',
        date: new Date().toLocaleDateString('ru-RU'),
        text
    })
    newComment.value = ''
}

// вложения
const attachments = ref([
    { id: 1, name: 'poty.jpg', type: 'image', size: '1.2 MB' },
    { id: 2, name: 'shema.pdf', type: 'pdf', size: '420 KB' }
])


const newFiles = ref([])

const fileIcon = (type) => {
    if (type === 'image') return 'mdi-file-image'
    if (type === 'pdf') return 'mdi-file-pdf-box'
    return 'mdi-file'
}

// история
const history = ref([
    { 
        id: 21,
        action: 'Создан дефект', 
        date: '02.11.2025', 
        author: 'Дарья Власова' 
    },
    { 
        id: 22,
        action: 'Назначен ответственный - Иван Петров', 
        date: '03.11.2025', 
        author: 'Менеджер проекта' 
    },
    { 
        id: 23,
        action: 'Статус изменён - Новая на В работе', 
        date: '05.11.2025', 
        author: 'Инженер технадзора' 
    },
])
</script>

<style scoped>
.details-page {
    min-height: 100vh;
    background-color: rgb(var(--v-theme-background));
    color: rgb(var(--v-theme-on-background));
    display: flex;
    justify-content: center;
    padding: 32px 16px 64px;
}

.details-wrapper {
    width: 100%;
    max-width: 1300px;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

header {
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

/* мейн */
main {
    display: flex;
    gap: 16px;
    align-items: flex-start;
}

.section-comments {
    width: 800px;
}
.right-column {
    width: 484px;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

/* карточки */
.section-card {
    padding: 16px 16px 18px;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    background-color: rgba(var(--v-theme-surface), 0.9);
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.section-title {
    font-size: 22px;
    font-weight: 600;
}

.section-divider {
    margin: 8px 0;
}

.empty-text {
    font-size: 14px;
    color: rgb(var(--v-theme-secondary));
}

/* коментарии */
.comments-body {
    height: 284px;
    overflow: scroll;
}

.comments-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: 0 4px;
}

.comment-item {
    padding: 12px;
    border-radius: 10px;
    background-color: rgba(255, 255, 255, 0.02);
}
.comment-item--mine {
    background-color: rgb(var(--v-theme-primary),0.1);
}
.comment-header {
    display: flex;
    justify-content: space-between;
    color: rgb(var(--v-theme-secondary));
}

.comment-author {
    color: rgb(var(--v-theme-secondary));
    font-size: 12px;
}

.comment-date {
    font-size: 12px;
    opacity: 0.9;
}

.comment-text {
    margin: 4px 0 ;
    font-size: 14px;
}

.comment-form {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

/* вложения */
.files-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    overflow: scroll;
    height: 142px;
}

.file-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background-color: rgba(255, 255, 255, 0.02);
    border-radius: 10px;
}

.file-main {
    display: flex;
    align-items: center;
    gap: 8px;
}

.file-name {
    font-size: 14px;
}

.file-meta {
    font-size: 12px;
    color: rgb(var(--v-theme-secondary));
}

.files-form {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

/* история */
.history-action {
    font-size: 14px;
}
.section-history {
    height: 224px;
    overflow: scroll;
}
.history-meta {
    margin: 2px 0;
    font-size: 12px;
    color: rgb(var(--v-theme-secondary));
}

:deep(.v-btn) {
    transition: all 0.4s ease-out;
}
:deep(.v-btn:active) {
    transform: scale(0.94);
}

@media (max-width: 1200px) {
    .details-page {
        padding: 24px 12px 48px;
    }
    .details-wrapper {
        max-width: 1120px;
    }
    main {
        flex-direction: column;
    }

    .section-comments,
    .right-column {
        width: 100%;
    }

    .comments-body {
        max-height: 260px;
    }

    .files-list {
        max-height: 180px;
    }

    .history-timeline {
        max-height: 180px;
    }
}

@media (max-width: 900px) {
    header {
        flex-direction: column;
        align-items: stretch;
    }
    header > div:last-child {
        display: flex;
        justify-content: flex-start;
        width: 100%;
    }
    header :deep(.v-btn) {
        width: 100%;
        justify-content: center;
    }
    .section-title {
        font-size: 20px;
    }
}

@media (max-width: 600px) {
    .details-page {
        padding: 16px 8px 32px;
    }
    header {
        padding: 16px 12px;
    }
    .header-title {
        font-size: 18px;
    }

    .section-card {
        padding: 12px 12px 14px;
    }

    .section-title {
        font-size: 18px;
    }

    .comment-text,
    .file-name,
    .history-action {
        font-size: 13px;
    }

    .file-meta,
    .history-meta,
    .comment-author,
    .comment-date {
        font-size: 11px;
    }
}
</style>
