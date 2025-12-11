<template>
  <div class="defects-page">
    <div class="defects-wrapper">
      <header>
        <div class="header-info">
          <div class="header-title">
            <v-icon icon="mdi-clipboard-text-outline" color="primary" size="40" />
              <h1 class="header-eyebrow">Журнал дефектов · OB-001</h1>
          </div>

          <div class="header-chips">
            <v-chip size="default" prepend-icon="mdi-alert-circle-outline">
              Всего дефектов: {{ defectStats.total }}
            </v-chip>
            <v-chip size="default" prepend-icon="mdi-progress-clock">
              Новые / в работе: {{ defectStats.open }}
            </v-chip>
            <v-chip size="default" prepend-icon="mdi-eye-arrow-right-outline">
              На проверке: {{ defectStats.inReview }}
            </v-chip>
            <v-chip size="default" prepend-icon="mdi-check-circle-outline">
              Закрыто / отменено: {{ defectStats.closed }}
            </v-chip>
          </div>
        </div>

        <div class="header-buttons">
          <v-btn
            color="primary"
            prepend-icon="mdi-plus"
            rounded="lg"
            size="large"
          >
            Новый дефект
          </v-btn>
          <v-btn
            color="primary"
            variant="tonal"
            rounded="lg"
            size="large"
            height="44"
              prepend-icon="mdi-arrow-left"
            >
              к проектам
            </v-btn>
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
            style="max-width: 420px;"
            prepend-inner-icon="mdi-magnify"
            label="Поиск по коду, названию и содержимому дефекта"
            clearable
          />

          <v-select
            v-model="statusFilter"
            :items="statusOptions"
            density="comfortable"
            hide-details
            variant="outlined"
            rounded="lg"
            color="primary"
            style="max-width: 240px;"
            prepend-inner-icon="mdi-filter-variant"
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
            :items="sortOptions"
            density="comfortable"
            hide-details
            variant="outlined"
            rounded="lg"
            color="primary"
            style="max-width: 320px;"
            prepend-inner-icon="mdi-arrow-up-down"
            label="Сортировка списка дефектов"
            clearable
          />
        </section>

        <section class="defects" v-if="filteredDefects.length">
          <v-card
            v-for="defect in filteredDefects"
            :key="defect.id"
            class="defect-card"
            :class="`status-${colorStatus(defect.status)}`"
            color="surface"
            rounded="xl"
          >
            <div class="card">
              <div>
                <p class="card-location">{{ defect.location }}</p>
                <p class="card-name">
                  {{ defect.title }}
                </p>
              </div>

              <v-chip
                :color="colorStatus(defect.status)"
                label
                size="small"
                variant="tonal"
                prepend-icon="mdi-progress-check"
              >
                {{ defect.status }}
              </v-chip>
            </div>

            <div class="card-info">
              
              <div class="card-text">
                <v-icon icon="mdi-tag-outline" size="18" :color="colorStatus(defect.status)" />
                <p>Код: {{ defect.id }}</p>
              </div>

              <div class="card-text">
                <v-icon icon="mdi-calendar-clock" size="18" :color="colorStatus(defect.status)" />
                <p>Срок: {{ formatDeadline(defect.deadline) }}</p>
              </div>

              
              
              <div class="card-text">
                <v-icon icon="mdi-account-outline" size="18" :color="colorStatus(defect.status)" />
                <p>Автор: {{ defect.author }}</p>
              </div>
              <div class="card-text">
                <v-icon icon="mdi-account-tie-outline" size="18" :color="colorStatus(defect.status)" />
                <p>Ответственный: {{ defect.responsible }}</p>
              </div>

            
            </div>
            <div class="card-footer">
              <div class="card-text">
                <v-icon icon="mdi-alert-decagram-outline" size="18" :color="colorStatus(defect.status)" />
                <p>Приоритет: {{ defect.priority }}</p>
              </div>

              <v-btn
                variant="text"
                :color="colorStatus(defect.status)"
                prepend-icon="mdi-open-in-new"
                rounded="lg"
                height="36"
              >
                Открыть
              </v-btn>
            </div>
          </v-card>
        </section>


        <section v-else class="zero-defects">
          <v-icon size="64" icon="mdi-clipboard-alert-outline" color="secondary"/>
            <p class="zero-title">Дефекты не найдены</p>
          <p class="zero-subtitle">Для этого объекта ещё не зарегистрированы дефекты или фильтры скрывают результаты.</p>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const defects = ref([
  {
    id: 'DF-001',
    location: 'Подъезд 1, этаж 12',
    title: 'Неровная шпаклёвка стен в гостиной',
    status: 'Новая',
    priority: 'Высокий',
    responsible: 'Иван Петров',
    author: 'Дарья Власова',
    deadline: '2025-11-10',
    comments: 3,
    attachments: 2,
  },
  {
    id: 'DF-002',
    location: 'Квартира 1204',
    title: 'Зазор между плинтусом и стеной',
    status: 'В работе',
    priority: 'Средний',
    responsible: 'Олег Смирнов',
    author: 'Инженер технадзора',
    deadline: '2025-11-15',
    comments: 1,
    attachments: 1,
  },
  {
    id: 'DF-003',
    location: 'Квартира 1207',
    title: 'Неплотное примыкание двери к коробке',
    status: 'На проверке',
    priority: 'Низкий',
    responsible: 'Иван Петров',
    author: 'Мастер участка',
    deadline: '2025-11-18',
    comments: 2,
    attachments: 1,
  },
  {
    id: 'DF-004',
    location: 'Щитовая 1',
    title: 'Перепутана маркировка автоматических выключателей',
    status: 'Новая',
    priority: 'Высокий',
    responsible: 'Иван Петров',
    author: 'Инженер ПТО',
    deadline: '2025-11-20',
    comments: 0,
    attachments: 2,
  },
  {
    id: 'DF-005',
    location: 'Лифт. холл, 10 этаж',
    title: 'Следы от краски на керамограните',
    status: 'В работе',
    priority: 'Средний',
    responsible: 'Олег Смирнов',
    author: 'Инженер технадзора',
    deadline: '2025-11-22',
    comments: 4,
    attachments: 3,
  },
  {
    id: 'DF-006',
    location: 'Квартира 1103',
    title: 'Царапины на остеклении лоджии',
    status: 'На проверке',
    priority: 'Высокий',
    responsible: 'Иван Петров',
    author: 'Заказчик',
    deadline: '2025-11-25',
    comments: 3,
    attachments: 4,
  },
  {
    id: 'DF-007',
    location: 'Квартира 903',
    title: 'Неправильный уклон плитки к трапу',
    status: 'Закрыта / Отмена',
    priority: 'Высокий',
    responsible: 'Иван Петров',
    author: 'Технадзор',
    deadline: '2025-10-30',
    comments: 2,
    attachments: 2,
  },
  {
    id: 'DF-008',
    location: 'Этаж 8',
    title: 'Разность оттенков краски на стенах',
    status: 'Закрыта / Отмена',
    priority: 'Низкий',
    responsible: 'Иван Петров',
    author: 'Заказчик',
    deadline: '2025-11-01',
    comments: 1,
    attachments: 1,
  },
  {
    id: 'DF-101',
    location: 'Парковочное место P-27',
    title: 'Подтекание воды по шву перекрытия',
    status: 'В работе',
    priority: 'Высокий',
    responsible: 'Игорь Михайлов',
    author: 'Технадзор',
    deadline: '2025-11-20',
    comments: 4,
    attachments: 3,
  },
])
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

const sortOptions = ['Сроки', 'Приоритет', 'Статус']
const statusOptions = ['Новая', 'В работе', 'На проверке', 'Закрыта / Отмена']
const priorityOptions = ['Высокий', 'Средний', 'Низкий']

const priorityOrder = {
  'Высокий': 1, 
  'Средний': 2, 
  'Низкий': 3 
}

const statusOrder = { 
  'Новая':1, 
  'В работе': 2, 
  'На проверке':3, 
  'Закрыта / Отмена':4 
}

const sortComparators = {
  Приоритет: (a, b) => (priorityOrder[a.priority] || 9999) - (priorityOrder[b.priority] || 9999),

  Статус: (a, b) => (statusOrder[a.status] || 9999) - (statusOrder[b.status] || 9999),

  Сроки: (a, b) => String(a.deadline || '').localeCompare(String(b.deadline || ''))
}

// поля, по которым ищем
const searchFields = ['id', 'title', 'location', 'responsible', 'author']

const matchesSearch = (defect, query) => {
  const i = String(query ?? '').trim().toLowerCase()
  if (!i) return true

  const tokens = i.split(/\s+/).filter(Boolean)

  // каждое слово должно встретиться хотя бы в одном из полей
  return tokens.every((token) => searchFields.some((field) => String(defect[field] || '').toLowerCase().includes(token)))
}

// одна функция: поиск + фильтр по статусу + фильтр по приоритету + сортировка
const prepareDefects = (
  list,
  {
    applySearch = true,
    applyStatusFilter = true,
    applyPriorityFilter = true,
    applySort = true
  } = {}
) => {
  let result = [...list]

  // поиск
  const searchValue = String(searchQuery.value ?? '')
  if (applySearch && searchValue.trim()) {
    result = result.filter((d) => matchesSearch(d, searchQuery.value))
  }

  // фильтр по статусу
  if (applyStatusFilter && statusFilter.value) {
    result = result.filter((d) => d.status === statusFilter.value)
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

// список для карточек (поиск + оба фильтра + сортировка)
const filteredDefects = computed(() =>
  prepareDefects(defects.value, {
    applySearch: true,
    applyStatusFilter: true,
    applyPriorityFilter: true,
    applySort: true
  })
)

// чипы в хедере (учитывают поиск и фильтры, но без сортировки)
const defectStats = computed(() => {
  const list = prepareDefects(defects.value, {
    applySearch: true,
    applyStatusFilter: true,
    applyPriorityFilter: true,
    applySort: false
  })

  const total = list.length
  let open = 0
  let inReview = 0
  let closed = 0

  list.forEach((i) => {
    if (i.status === 'Новая' || i.status === 'В работе') open++
    if (i.status === 'На проверке') inReview++
    if (i.status === 'Закрыта / Отмена') closed++
  })

  return {
    total,
    open,
    inReview,
    closed
  }
})
</script>

<style scoped>
.defects-page {
  min-height: 100vh;
  background-color: rgb(var(--v-theme-background));
  color: rgb(var(--v-theme-on-background));
  display: flex;
  justify-content: center;
  padding: 32px 16px 64px;
}

.defects-wrapper {
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

.header-info {
  display: flex;
  gap: 10px;
  flex-direction: column;
}

.header-title {
  display: flex;
  gap: 10px;
  align-items: center;
}

.header-title h1 {
  font-weight: 700;
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

/* фильтры */
.filters-card {
  padding: 14px 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  background-color: rgba(var(--v-theme-surface), 0.85);
  display: flex;
  gap: 10px;
}

/* карточки */
.defects {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.defect-card {
  width: 422px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.04);
  transition: all 0.4s ease-out
}

.defect-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.defect-card.status-primary:hover {
  border-color: rgba(var(--v-theme-primary), 0.2);
}

.defect-card.status-secondary:hover {
  border-color: rgba(var(--v-theme-secondary), 0.2);
}

/* внутренность карточки – такие же классы, как у projects */
.card {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: flex-start;
}
.card-location {
  font-size: 14px;
  color: rgb(var(--v-theme-secondary));
}
.card-name {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  line-height: 1.2;
  max-width: 240px;
}

.card-info {
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

.card-footer {
  margin-top: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}



/* общие стили кнопок и чип */
:deep(.v-btn) {
  transition: transform 0.4s ease-out;
}
:deep(.v-btn:active) {
  transform: scale(0.94);
}

.header-chips :deep(.v-chip) {
  transition: all 0.4s ease-out;
}
.header-chips :deep(.v-chip:hover) {
  transform: translateY(-2px);
}

/* сообщение об отсутсвие дефектов */
.zero-defects {
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
  max-width: 420px;
  color: rgb(var(--v-theme-secondary));
}

/* адаптив */

@media (max-width: 1200px) {
  .defects-wrapper {
    max-width: 1120px;
  }

  .defects {
    justify-content: center;
  }

  .defect-card {
    width: 48%;
  }

  header {
    align-items: flex-end;
  }
}

@media (max-width: 1050px) {
  .defects-page {
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

  .defects {
    justify-content: center;
  }

  .defect-card {
    width: 100%;
  }
  .card-name {
    max-width: 100%;
  }
}

@media (max-width: 780px) {
  .defects-page {
    padding: 20px 10px 36px;
  }

  header {
    padding: 16px 12px;
  }

  .header-title h1 {
    font-size: 20px;
  }

  .defect-card {
    padding: 16px 14px;
  }

  .card-name {
    font-size: 18px;
    max-width: 100%;
  }

  .card-location {
    font-size: 13px;
  }

  .card-text {
    font-size: 13px;
  }
}

@media (max-width: 600px) {
  .defects-page {
    padding: 16px 8px 32px;
  }

  header {
    padding: 14px 10px;
  }

  .header-buttons .v-btn {
    width: 100%;
  }

  .header-chips {
    gap: 6px;
  }

  .filters-card {
    padding: 12px;
    gap: 8px;
  }

  .defect-card {
    padding: 16px 14px;
  }

  .card {
    flex-direction: column;
    gap: 6px;
  }


  .zero-defects {
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
