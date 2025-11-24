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
              density="comfortable"
              hide-details
              variant="outlined"
              rounded="lg"
              color="primary"
              style=" max-width: 420px;"
              prepend-inner-icon="mdi-magnify"
              label="Поиск по объекту, этапу или ответственному"
              clearable
            />
            <v-select
              density="comfortable"
              hide-details
              variant="outlined"
              rounded="lg"
              color="primary"
              style=" max-width: 305px;"
              prepend-inner-icon="mdi-filter-variant"
              :items="['Все статусы', 'Новая', 'В работе', 'На проверке', 'Закрыта / Отмена']"
              label="Фильтр по статусу дефектов"
              clearable
            />
            <v-select
              density="comfortable"
              hide-details
              variant="outlined"
              rounded="lg"
              color="primary"
              style="max-width: 310px;"
              prepend-inner-icon="mdi-arrow-up-down"
              :items="['Сроки', 'Приоритет', 'Статус']"
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

        <section class="projects">
            <v-card 
              class="project-card"
              :class="`status-${colorStatus(project.status)}`"
              color="surface" 
              rounded="xl" 
              v-for="project in projects" 
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

const projectStats = computed(() => {
  let projectCount = projects.value.length
  let defectsOpen = 0
  let defectsClosed = 0
  projects.value.forEach((i) => {
    defectsOpen+= i.defectsOpen
    defectsClosed+= i.defectsClosed
  })
  let defectsCount = defectsOpen + defectsClosed
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
  align-items: center;
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
/* стили для chip */
:deep(.v-btn:active) {
  transform: scale(0.94);
}
:deep(.v-chip) {
  transition: all 0.4s ease-in-out;
}
:deep(.v-chip:hover) {
  transform: scale(0.98);
  color: rgb(var(--v-theme-primary));
}
</style>
