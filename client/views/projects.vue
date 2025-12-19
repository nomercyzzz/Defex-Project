<template>
  <div class="projects-page">
    <transition name="fade" mode="out-in">
      <div 
        v-if="loading" 
        key="loader"
        class="d-flex justify-center align-center w-100" 
        style="height: 100vh; position: fixed;"
      >
          <v-progress-circular indeterminate color="primary" size="64" />
      </div>
      <div v-else key="content" class="projects-wrapper">
        <projectAdd
          v-model="showAddDialog" 
          :loading="saving" 
          @save="onSaveNewProject"
        />

        <projectEdit
            v-model="showEditDialog" 
            :project="editingProject" 
            :loading="saving" 
            @save="onSaveEditProject" 
            @delete="onDeleteProject" 
        />
        <!-- снекбары -->
        <SnackbarOk :message="snackbarOk"/>
        <SnackbarError :message="snackbarError"/>
          
        <header>
            <div class="header-info">
              <div class="header-title">
                <v-icon icon="mdi-domain" color="primary" size="40" />
                <h1>Объекты и этапы работ</h1>
              </div>
              <div class="header-chips">
                <v-chip
                  size="default"
                  prepend-icon="mdi-office-building-outline"
                  >
                  Проектов: {{ projectStats.total }}
                </v-chip>
                <v-chip
                  size="default"
                  prepend-icon="mdi-progress-clock"
                  >
                  Новые / в работе: {{ projectStats.active  }}
                </v-chip>
                <v-chip
                  size="default"
                  prepend-icon="mdi-eye-arrow-right-outline"
                >
                  На проверке: {{ projectStats.inReview }}
                </v-chip>
                <v-chip
                  size="default"
                  prepend-icon="mdi-check-circle-outline"
                >
                  Закрыто / отменено: {{ projectStats.closed }}
                </v-chip>
              </div>
            </div>

            <div class="header-buttons">
              <v-btn
                v-if="authStore.isManager"
                color="primary"
                prepend-icon="mdi-plus" 
                rounded="lg" 
                size="large"
                @click="openAddDialog"
                >
                Новый проект
              </v-btn>
              <v-btn
                v-else-if="authStore.role"
                color="primary"
                prepend-icon="mdi-chart-bar" 
                rounded="lg" 
                size="large"
                @click="router.push('/report')"
                >
                Аналитика и отчётность
              </v-btn>

              <profile />
            </div>
        </header>

        <main>
          <section class="filters-card">
              <v-text-field
                v-model="searchQuery"
                density="comfortable"
                hide-details
                variant="outlined"
                rounded="lg"
                color="primary"
                style=" max-width: 420px;"
                prepend-inner-icon="mdi-magnify"
                label="Поиск по объекту, коду или описанию"
                clearable
              />
              <v-select
                v-model="statusFilter"
                density="comfortable"
                hide-details
                variant="outlined"
                rounded="lg"
                color="primary"
                style=" max-width: 240px;"
                prepend-inner-icon="mdi-filter-variant"
                :items="statusOptions"
                label="Фильтр по статусу"
                clearable
              />
              <v-select
                v-model="priorityFilter"
                :items="priorityOptions"
                density="comfortable"
                hide-details
                variant="outlined"
                rounded="lg"
                color="primary"
                style="max-width: 260px;"
                prepend-inner-icon="mdi-alert-decagram-outline"
                label="Фильтр по приоритету"
                clearable
              />
              <v-select
                v-model="sortOption"
                density="comfortable"
                hide-details
                variant="outlined"
                rounded="lg"
                color="primary"
                style="max-width: 310px;"
                prepend-inner-icon="mdi-arrow-up-down"
                :items="sortOptions"
                label="Сортировка списка проектов"
                clearable
              />
          </section>
          
            <transition-group
              name="list"
              appear
              tag="section"
              class="projects"
              v-if="filteredProjects.length"
            >
              <v-card 
                class="project-card"
                :class="`status-${colorStatus(project.status)}`"
                color="surface"
                rounded="xl"
                v-for="(project, index) in filteredProjects" 
                :key="project.code"
                :style="{ '--i': index }"
              >
                <div class="card">
                  <div>
                    <p class="card-stage">{{ project.stage }}</p>
                    <h2 class="card-name">{{ project.name }}</h2>
                  </div>
                  <div class="d-flex flex-column align-end ">
                    <v-chip
                      :color="colorStatus(project.status)"
                      label
                      size="small"
                      variant="tonal"
                      prepend-icon="mdi-progress-check"
                    >
                      {{ project.status }}
                    </v-chip>

                    <v-btn 
                      v-if="authStore.isManager"
                      variant="text"
                      lebal
                      size="small"
                      color="secondary"
                      prepend-icon="mdi-pencil-outline"
                      class="mt-1"
                      density="comfortable"
                      @click="openEditDialog(project) "
                      > Ред. </v-btn> 
                  </div>
                </div>

                <div class="card-info">
                  <div class="card-text">
                    <v-icon icon="mdi-tag-outline" size="18" :color="colorStatus(project.status)"/>
                    <p>{{ project.code }}</p>
                  </div>
                  <div class="card-text">
                    <v-icon icon="mdi-map-marker-outline" size="18" :color="colorStatus(project.status)"/>
                    <p>{{ project.location }}</p>
                  </div>
                  <div class="card-text">
                    <v-icon icon="mdi-calendar-clock" size="18" :color="colorStatus(project.status)" />
                    <p>Срок: {{ formatDeadline(project.deadline) }}</p>
                  </div>
                  <div class="card-text">
                    <v-icon icon="mdi-account-tie-outline" size="18" :color="colorStatus(project.status)" />
                    <p>Ответственный: {{ project.manager }}</p>
                  </div>
                  
                </div>

                <v-progress-linear
                  :model-value="project.progress"
                  :color="colorStatus(project.status)"
                  height="8"
                  rounded="lg"
                  class="progress-bar"
                />

                <div class="card-progress card-text">
                  <p>{{ project.progress }}% готовности</p>
                  <p>{{ project.defectsOpen }} дефектов / {{ project.defectsClosed }} закрыто</p>
                </div>

                <div class="card-footer">
                  <div class="card-text">
                    <v-icon icon="mdi-alert-decagram-outline" size="18" :color="colorStatus(project.status)" />
                    <p>Приоритет: {{ project.priority }}</p>
                  </div>
                  <v-btn
                    variant="text"
                    :color="colorStatus(project.status)"
                    prepend-icon="mdi-open-in-new"
                    rounded="lg"
                    height="36"
                    @click="router.push(`/projects/${project.code}/defects`)"
                  >
                    Открыть
                  </v-btn>
                </div>
              </v-card>
            </transition-group >
          <section v-else class="zero-projects">
            <v-icon size="64" icon="mdi-folder-open-outline" color="secondary"/>
              <p class="zero-title">Нет проектов</p>
            <p class="zero-subtitle">Измените фильтры или создайте первый проект, чтобы начать фиксировать дефекты</p>
          </section>
        </main>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth.js'
import projectAdd from '../components/projectAdd.vue'
import projectEdit from '../components/projectEdit.vue'
import SnackbarOk from '../components/snackbarOk.vue'
import SnackbarError from '../components/snackbarError.vue'
import profile from '../components/profile.vue'

import axios from 'axios'

const loading = ref(true);
const router = useRouter();
const authStore = useAuthStore();

onMounted(async () => {
  try {
    const response = await axios.get('/api/projects')
    projects.value = response.data
    loading.value = false;
  } catch (error) {
    console.log('Ошибка при получении проектов:', error)
    projects.value = []
    loading.value = false;
  }
})

const projects = ref([]);
// состояние диалогов для добавления и редактирования 
const showAddDialog = ref(false)
const showEditDialog = ref(false)
const editingProject = ref(null)
const saving = ref(false)
// снекбары если ошибка 
const snackbarError = ref('')
const snackbarOk = ref('')

// функции для очистки снекбара 
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
const openAddDialog = () => {
  showAddDialog.value = true;
}
const openEditDialog = (project) => {
  // берем данные проекта в ред
  editingProject.value = project;
  showEditDialog.value = true;
} 
// сохранение нового проекта 
const onSaveNewProject = async(newProject) => {
  saving.value = true;
  try {
    const response = await axios.post('/api/projects', newProject);
    projects.value.push(response.data.project);

    snackbarOk.value = response.data.message;
    clearOkSnackbar();

    saving.value = false;
    showAddDialog.value = false;
  } catch (error) {
    snackbarError.value = error.response.data.message;
    clearErrorSnackbar();
    
    saving.value = false;
  }
}

const onSaveEditProject = async(updateProject) => {
  saving.value = true;
  try {
    const response = await axios.put(`/api/projects/${updateProject._id}`, updateProject);
    const index = projects.value.findIndex(p => p._id === updateProject._id);

    if (index !== -1) {
      projects.value[index] = { ...updateProject };
    }

      snackbarOk.value = response.data.message;
      clearOkSnackbar();  

      saving.value = false;
      showEditDialog.value = false;

      editingProject.value = null;
    } catch (error) {
      snackbarError.value = error.response.data.message;
      clearErrorSnackbar();

      saving.value = false;
    }
  }

const onDeleteProject = async (code) => {
  try {
    const response = await axios.delete(`/api/projects/${code}`)
    projects.value = projects.value.filter(d => d.code !== code) 

    snackbarOk.value = response.data.message;
    clearOkSnackbar();

    showEditDialog.value = false

    } catch(error) { 
      snackbarError.value = error.response.data.message;
      clearErrorSnackbar();

      saving.value = false;
    }
}

// функция для получения цвета
const colorStatus = (status) => {
  return status === 'Новая' || status === 'В работе' ? 'primary' : 'secondary';
}
// функция для перевода даты
const formatDeadline = (deadline) => {
  if (!deadline) return ''

  const sorted = deadline.split('-').reverse()
  return sorted.join('.')
}

const searchQuery = ref('')
const statusFilter = ref(null)
const priorityFilter = ref(null)
const sortOption = ref(null)

const sortOptions = ['Сроки','Приоритет','Статус']
const statusOptions = ['Новая','В работе','На проверке', 'Закрыта / Отмена']
const priorityOptions = ['Высокий','Средний','Низкий']

const priorityOrder = { 
  'Высокий':1, 
  'Средний':2, 
  'Низкий': 3 
}
const statusOrder = { 
  'Новая':1, 
  'В работе': 2, 
  'На проверке':3, 
  'Закрыта / Отмена':4 
}
// функция для сортировки 
const sortComparators = {
  Приоритет: (a, b) => (priorityOrder[a.priority] || 9999) - (priorityOrder[b.priority] || 9999),

  Статус: (a, b) => (statusOrder[a.status] || 9999) - (statusOrder[b.status] || 9999),

  Сроки: (a, b) => String(a.deadline || '').localeCompare(String(b.deadline || ''))
}

const searchFields = ['name', 'stage', 'code', 'manager', 'location', 'deadline']

const matchesSearch = (project, query) => {
  const i = String(query ?? '').trim().toLowerCase()
  if (!i) return true

  const tokens = i.split(/\s+/).filter(Boolean) // разбиваем на слова

  // каждое слово должно хотя бы в ожном из полей встретиться
  return tokens.every((token) => searchFields.some((field) => String(project[field] || '').toLowerCase().includes(token)))
}

// одна функция поиск + фильтр + сортировка
const prepareProjects = (
  list,
  {
    applySearch = true,
    applyStatusFilter = true,
    applyPriorityFilter = true,
    applySort = true
  } = {}
) => {
  let result = [...list]

  // поиск по нескольким полям
  const searchValue = String(searchQuery.value ?? '')
  if (applySearch && searchValue.trim()) {
    result = result.filter((p) => matchesSearch(p, searchQuery.value))
  }

  // фильтр по статусу
  if (applyStatusFilter && statusFilter.value) {
    result = result.filter((p) => p.status === statusFilter.value)
  }

  // фильтр по приоритету
  if (applyPriorityFilter && priorityFilter.value) {
    result = result.filter((d) => d.priority === priorityFilter.value)
  }

  // сортировка
  if (applySort && sortOption.value) {
    const comparator = sortComparators[sortOption.value]
    if (comparator) {
      result = result.sort(comparator)
    }
  }

  return result
}

// список для карточек (учитыая поиск и флльтр и сортировку)
const filteredProjects = computed(() => prepareProjects(projects.value, {
    applySearch: true,
    applyStatusFilter: true,
    applyPriorityFilter: true,
    applySort: true
  })
)

// чипы (учитывают поиск и фильтр)
const projectStats = computed(() => {
  const list = prepareProjects(projects.value, {
    applySearch: true,
    applyStatusFilter: true,
    applySort: false
  })

  const total = list.length
  let newCount = 0
  let inWork = 0
  let inReview = 0
  let closed = 0

  list.forEach((i) => {
    if (i.status === 'Новая') newCount++
    else if (i.status === 'В работе') inWork++
    else if (i.status === 'На проверке') inReview++
    else if (i.status === 'Закрыта / Отмена') closed++
  })
  return {
    total,
    active: newCount + inWork,
    inReview,
    closed
  }
})
</script>

<style scoped>
.projects-page {
  min-height: 100vh;
  background-color: rgb(var(--v-theme-background));
  color: rgb(var(--v-theme-on-background));
  display: flex;
  justify-content: center;
  padding: 32px 16px 64px;
  
}

.projects-wrapper {
  width: 100%;
  max-width: 1300px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
/* хедер */
header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
  padding: 20px 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  background-color: rgba(var(--v-theme-surface), 0.9);
}

.header-info{
  display: flex;
  gap: 10px;
  flex-direction: column;
}
.header-title {
  display: flex;
  gap: 10px;
  align-items: center;
}

.header-title h1{
  font-weight: 600;
  line-height: 1.2;
}

.header-chips {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}

.header-buttons {
  display: flex;
  gap: 10px;
}
/* мейн */
main {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
/* фильтр карточек */
.filters-card {
  padding: 14px 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  background-color: rgba(var(--v-theme-surface), 0.85);
  display: flex;
  gap: 10px;
}

/* карточки */
.projects {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.project-card {
  width: 422px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.04);
  transition: all 0.4s ease-out;
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.project-card.status-primary:hover {
  border-color: rgba(var(--v-theme-primary), 0.2);
}

.project-card.status-secondary:hover {
  border-color: rgba(var(--v-theme-secondary), 0.2);
}

.card {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: flex-start;
}


.card-stage {
  margin: 0 0 4px;
  color: rgb(var(--v-theme-secondary));
  font-size: 14px;
}

.card-name {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  line-height: 1.2;
}

.card-info{
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
}

.card-text {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgb(var(--v-theme-secondary));
  font-size: 14px;
}

.progress-bar {
  margin-top: 14px;
}

.card-progress {
  margin-top: 8px;
  display: flex;
  justify-content: space-between;
}

.card-footer {
  margin-top: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
/* общие стили для кнопок  */
:deep(.v-btn) {
  transition: all 0.4s ease-out;
}
:deep(.v-btn:active) {
  transform: scale(0.94);
}
/* стили для chip */
.header-chips :deep(.v-chip) {
  transition: all 0.4s ease-out;
}
.header-chips :deep(.v-chip:hover) {
  transform: translateY(-2px);
}

/* анимация карточек */
projects {
  position: relative;
}
/* работает только при входе - используем переменную индекса */
.list-enter-active {
  transition: all 0.4s ease-out;
  transition-delay: calc(var(--i) * 100ms);
}

/* исчезновение */
.list-leave-active {
  transition: all 0.4s ease-out;

  position: absolute; 
  z-index: -1;
}

/* начальное, конечное состояние) */
.list-enter-from, .list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

/* сортировка */
.list-move {
  transition: transform 0.8s cubic-bezier(0.25, 1, 0.5, 1);
  transition-delay: 0s !important; 
}
/* отключаем transition самой карточки во время сортировки, чтобы управлял только transition-group */
.list-move .project-card {
  transition: none !important;
}

/* сообщение об отсутсвие проектов */
.zero-projects {
  padding: 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  color: rgb(var(--v-theme-secondary));
}

.zero-title {
  font-size: 20px;
  font-weight: 600;
  color: rgb(var(--v-theme-on-background));
}

.zero-subtitle {
  font-size: 16px;
  line-height: 1.4;
  max-width: 400px;
  color: rgb(var(--v-theme-secondary));
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

@media (max-width: 1200px) {
  .projects-wrapper {
    max-width: 1120px;
  }
  .projects {
    justify-content: center;
  }
  .project-card {
    width: 48%;
  }
  header {
    align-items:flex-end;
  }
}


@media (max-width: 1050px) {
  .projects-page {
    padding: 24px 12px 48px;
  }

  header {
    flex-direction: column;
    align-items: stretch;
  }

  .header-info {
    width: 100%;
  }

  .header-buttons {
    width: 100%;
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  .header-buttons .v-btn {
    min-width: 160px;
  }

  .header-chips {
    flex-wrap: wrap;
  }
  .filters-card {
    flex-direction: column;
    align-items: stretch;
  }

  .filters-card > * {
    width: 100% !important;
    max-width: 100% !important;
  }

  .projects {
    justify-content: center;
  }

  .project-card {
    width: 100%;
  }
}


@media (max-width: 892px) {
  .project-card {
    width: 100%;
  }
}

@media (max-width: 600px) {
  .projects-page {
    padding: 16px 8px 32px;
  }
  
  header {
    padding: 16px 12px;
  }
  .header-buttons .v-btn {
    width: 100%;            
  }
  .header-buttons .v-btn.v-btn--icon{
    width: 100% !important;
  }
  .header-title h1 {
    font-size: 20px;
  }

  .header-chips {
    gap: 6px;
  }

  .filters-card {
    padding: 12px;
    gap: 8px;
  }

  .project-card {
    padding: 16px 14px;
  }

  .card-name {
    font-size: 18px;
  }

  .card-stage {
    font-size: 13px;
  }

  .card-text {
    font-size: 13px;
  }

  .zero-projects {
    padding: 32px 24px;
  }

  .zero-title {
    font-size: 18px;
  }

  .zero-subtitle {
    font-size: 14px;
  }
}

</style>
