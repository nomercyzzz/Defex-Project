<template>
  <div class="projects-page">
    <div class="projects-wrapper">
      <header>
          <div class="header-info">
            <div class="header-title">
              <v-icon icon="mdi-timeline-text-outline" color="primary" size="40" />
              <h1>Объекты и этапы работ</h1>
            </div>
            <div class="header-chips">
              <v-chip
                size="default"
                prepend-icon="mdi-office-building-outline"
                >
                Проектов: {{ projectStats.projectCount }}
              </v-chip>
              <v-chip
                size="default"
                prepend-icon="mdi-alert-circle-outline"
                >
                Всего дефектов: {{ projectStats.defectsCount }}
              </v-chip>
              <v-chip
                size="default"
                prepend-icon="mdi-progress-clock"
              >
                Открытых дефектов: {{ projectStats.defectsOpen }}
              </v-chip>
              <v-chip
                size="default"
                prepend-icon="mdi-check-circle-outline"
              >
                Закрытых дефектов: {{ projectStats.defectsClosed }}
              </v-chip>
            </div>
          </div>

          <div class="header-buttons">
            <v-btn color="primary" prepend-icon="mdi-plus" rounded="lg" size="large" >
              Новый проект
            </v-btn>
            <v-btn
              color="primary"
              variant="tonal"
              rounded="lg"
              size="44"              
              icon="mdi-account-circle-outline"
            />
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
              label="Поиск по объекту, этапу, коду или ответственному"
              clearable
            />
            <v-select
              v-model="statusFilter"
              density="comfortable"
              hide-details
              variant="outlined"
              rounded="lg"
              color="primary"
              style=" max-width: 305px;"
              prepend-inner-icon="mdi-filter-variant"
              :items="statusOptions"
              label="Фильтр по статусу проекта"
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
            <v-btn
              color="primary"
              variant="tonal"
              rounded="lg"
              size="large"
              height="48"
              prepend-icon="mdi-file-excel-outline"
            >
              Экспорт Excel
            </v-btn>
        </section>

        <section class="projects" v-if="filteredProjects.length">
            <v-card 
              class="project-card"
              :class="`status-${colorStatus(project.status)}`"
              color="surface" 
              rounded="xl" 
              v-for="project in filteredProjects" 
              :key="project.code"
            >
              <div class="card">
                <div>
                  <p class="card-stage">{{ project.stage }}</p>
                  <h2 class="card-name">{{ project.name }}</h2>
                </div>
                <v-chip
                  :color="colorStatus(project.status)"
                  label
                  size="small"
                  variant="tonal"
                  prepend-icon="mdi-progress-check"
                >
                  {{ project.status }}
                </v-chip>
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
                  <p>Срок: {{ project.deadline }}</p>
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
                >
                  Открыть
                </v-btn>
              </div>
            </v-card>
        </section>
        <section v-else class="zero-projects">
          <v-icon size="64" icon="mdi-folder-open-outline" color="secondary"/>
            <p class="zero-title">Нет проектов</p>
          <p class="zero-subtitle">Измените фильтры или создайте первый проект, чтобы начать фиксировать дефекты.</p>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const projects = ref([
  {
    code: 'OB-001',
    name: 'ЖК «Северный квартал»',
    stage: 'Корпус A · отделка и инженерка',
    status: 'В работе',
    location: 'Москва, Лианозово',
    deadline: '12 декабря',
    manager: 'Дарья Власова',
    progress: 72,
    defectsOpen: 5,
    defectsClosed: 18,
    priority: 'Средний'
  },
  {
    code: 'BC-002',
    name: 'БЦ «Нева Плаза»',
    stage: 'Паркинг и фасады',
    status: 'На проверке',
    location: 'Санкт-Петербург, Петроградская',
    deadline: '5 января',
    manager: 'Игорь Михайлов',
    progress: 64,
    defectsOpen: 7,
    defectsClosed: 25,
    priority: 'Высокий'
  },
  {
    code: 'TRK-003',
    name: 'ТРК «Каскад»',
    stage: 'Торговая галерея',
    status: 'Новая',
    location: 'Екатеринбург, центр',
    deadline: '20 января',
    manager: 'Полина Орлова',
    progress: 38,
    defectsOpen: 9,
    defectsClosed: 11,
    priority: 'Средний'
  },
  {
    code: 'JK-004',
    name: 'ЖК «Южный берег»',
    stage: 'Благоустройство и подъезды',
    status: 'В работе',
    location: 'Сочи, Хоста',
    deadline: '2 февраля',
    manager: 'Андрей Козлов',
    progress: 81,
    defectsOpen: 3,
    defectsClosed: 29,
    priority: 'Низкий'
  }
])
// функция для получения цвета
const colorStatus = (status) => {
  return status === 'Новая' || status === 'В работе' ? 'primary' : 'secondary';
}

const searchQuery = ref('')
const statusFilter = ref(null)
const sortOption = ref(null)

const sortOptions = ['Сроки', 'Приоритет', 'Статус']
const statusOptions = ['Все статусы', 'Новая', 'В работе', 'На проверке', 'Закрыта / Отмена']

const priorityOrder = { 'Высокий': 1, 'Средний': 2, 'Низкий': 3 }
const statusOrder = { 'Новая': 1, 'В работе': 2, 'На проверке': 3, 'Закрыта / Отмена': 4 }

const sortComparators = {
  Приоритет: (a, b) => (priorityOrder[a.priority] || 99) - (priorityOrder[b.priority] || 99),
  Статус: (a, b) => (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99),
  Сроки: (a, b) => String(a.deadline).localeCompare(String(b.deadline), 'ru')
}

const searchFields = ['name', 'stage', 'code', 'manager']

const matchesSearch = (project, query) => {
  const i = query.trim().toLowerCase()
  if (!i) return true

  const tokens = i.split(/\s+/).filter(Boolean) // разбиваем на слова

  // каждое слово должно хотя бы в ожном из полей встретиться
  return tokens.every((token) => searchFields.some((field) => String(project[field] || '').toLowerCase().includes(token)
    )
  )
}

// одна функция поиск + фильтр + сортировка
const prepareProjects = (
  list,
  {
    applySearch = true,
    applyStatusFilter = true,
    applySort = true
  } = {}
) => {
  let result = [...list]

  // поиск по нескольким полям
  if (applySearch && searchQuery.value.trim()) {
    result = result.filter((p) => matchesSearch(p, searchQuery.value))
  }

  // фильтр по статусу
  if (applyStatusFilter && statusFilter.value && statusFilter.value !== 'Все статусы') {
    result = result.filter((p) => p.status === statusFilter.value)
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

  const projectCount = list.length
  let defectsOpen = 0
  let defectsClosed = 0

  list.forEach((i) => {
    defectsOpen += i.defectsOpen
    defectsClosed += i.defectsClosed
  })

  const defectsCount = defectsOpen + defectsClosed

  return {
    projectCount,
    defectsOpen,
    defectsClosed,
    defectsCount
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
  transition: all 0.4s ease-in-out;
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
  transition: transform 0.4s ease-out;
}
:deep(.v-btn:active) {
  transform: scale(0.94);
}
/* стили для chip */
:deep(.v-chip) {
  transition: all 0.4s ease-in-out;
}
:deep(.v-chip:hover) {
  transform: scale(0.99);
  color: rgb(var(--v-theme-primary));
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
