<template>
    <div class="report-page">
        <transition name="fade" mode="out-in">
            <div 
                v-if="loading" 
                key="loader"
                class="d-flex justify-center align-center w-100" 
                style="height: 100vh; position: fixed;"
            >
                <v-progress-circular indeterminate color="primary" size="64" />
            </div>
            <div v-else key="content" class="report-wrapper">
                <header>
                    <div class="header-title">
                        <v-icon icon="mdi-chart-bar" color="primary" size="40"/>
                        <h1> Аналитика и отчётность </h1>
                    </div>
                    <div class="header-buttons">
                        <v-btn
                            color="primary"
                            rounded="lg"
                            size="large"
                            prepend-icon="mdi-download"
                            @click="downloadReportCsv"
                        > Скачать отчет </v-btn>
                        <v-btn
                            color="primary"
                            variant="tonal"
                            rounded="lg"
                            size="large"
                            height="44"
                            prepend-icon="mdi-arrow-left"
                            @click="router.push('/home')"
                        > к проектам </v-btn>
                    </div>
                </header>

                <div class="stat-cards">  
                    <v-card class="stat-card" color="surface" rounded="xl">
                        <v-sheet class="color-primary d-flex justify-center align-center" width="56" height="56" style="border-radius: 16px;">
                            <v-icon icon="mdi-alert-circle-outline" color="primary" size="28"/>
                        </v-sheet>
                        <div>
                            <p class="stat-value"> 9 </p>
                            <p class="stat-label"> Всего дефектов </p>
                        </div>
                    </v-card>

                    <v-card class="stat-card" color="surface" rounded="xl">
                        <v-sheet class="color-primary d-flex justify-center align-center" width="56" height="56" style="border-radius: 16px;">
                            <v-icon icon="mdi-speedometer" color="primary" size="28"/>
                        </v-sheet>
                        <div>
                            <p class="stat-value"> 22% </p>
                            <p class="stat-label"> Эффективность </p>
                        </div>
                    </v-card>

                    <v-card class="stat-card" color="surface" rounded="xl">
                        <v-sheet class="color-secondary d-flex justify-center align-center" width="56" height="56" style="border-radius: 16px;">
                            <v-icon icon="mdi-clock-alert-outline" color="secondary" size="28"/>
                        </v-sheet>
                        <div>
                            <p class="stat-value"> 3 </p>
                            <p class="stat-label"> Просрочено </p>
                        </div>
                    </v-card>

                    <v-card class="stat-card" color="surface" rounded="xl">
                        <v-sheet class="color-secondary d-flex justify-center align-center" width="56" height="56" style="border-radius: 16px;">
                            <v-icon icon="mdi-check-circle-outline" color="secondary" size="28"/>
                        </v-sheet>
                        <div>
                            <p class="stat-value"> 4 </p>
                            <p class="stat-label"> Активных проектов </p>
                        </div>
                    </v-card>
                </div>

                <main>
                    <section class="charts-container">
                        <v-card color="surface" rounded="xl" class="chart-card">
                            <div style="margin-bottom: 12px;">
                                <div class="card-title">
                                    <v-icon icon="mdi-bug-outline" color="secondary" class="mr-2" size="30" />
                                    <h2> Дефекты по статусам </h2>
                                </div>
                            </div>
                            
                            <div class="stats-list">
                                <div class="stat-item">
                                    <div class="stat-header">
                                        <P class="stat-name"> Новая </P>
                                        <P class="stat-numbers"> 3 шт. </P>
                                    </div>
                                    <div class="stat-progress-wrapper">
                                        <v-progress-linear 
                                            model-value="61" 
                                            color="primary" 
                                            height="8" 
                                            rounded
                                        />
                                        <P class="stat-percent text-primary"> 61% </P>
                                    </div>
                                </div>

                                <div class="stat-item">
                                    <div class="stat-header">
                                        <p class="stat-name"> В работе </p>
                                        <p class="stat-numbers"> 2 шт. </p>
                                    </div>
                                    <div class="stat-progress-wrapper">
                                        <v-progress-linear 
                                            model-value="78" 
                                            color="primary" 
                                            height="8" 
                                            rounded 
                                        />
                                        <p class="stat-percent text-primary"> 78% </p>
                                    </div>
                                </div>

                                <div class="stat-item">
                                    <div class="stat-header">
                                        <p class="stat-name"> На проверке </p>
                                        <p class="stat-numbers"> 1 шт. </p>
                                    </div>
                                    <div class="stat-progress-wrapper">
                                        <v-progress-linear 
                                            model-value="11" 
                                            color="secondary" 
                                            height="8" 
                                            rounded 
                                            />
                                        <p class="stat-percent text-secondary"> 11% </p>
                                    </div>
                                </div>

                                <div class="stat-item">
                                    <div class="stat-header">
                                        <p class="stat-name">Закрыта / Отмена</p>
                                        <p class="stat-numbers">3 шт.</p>
                                    </div>
                                    <div class="stat-progress-wrapper">
                                        <v-progress-linear 
                                            model-value="33" 
                                            color="secondary" 
                                            height="8" 
                                            rounded 
                                        />
                                        <p class="stat-percent text-secondary"> 33% </p>
                                    </div>
                                </div>
                            </div>
                        </v-card>

                        <v-card color="surface" rounded="xl" class="chart-card">
                            <div style="margin-bottom: 12px;">
                                <div class="card-title">
                                    <v-icon icon="mdi-alert-decagram-outline" color="secondary" class="mr-2" size="30"/>
                                    <h2>Приоритетность</h2>
                                </div>
                            </div>
                            
                            <div class="stats-list">
                                <div class="stat-item">
                                    <div class="stat-header">
                                        <p class="stat-name"> Высокий </p>
                                        <p class="stat-numbers"> 4 шт. </p>
                                    </div>
                                    <div class="stat-progress-wrapper">
                                        <v-progress-linear 
                                            model-value="54" 
                                            color="primary" 
                                            height="8" 
                                            rounded
                                        />
                                        <p class="stat-percent text-primary"> 54% </p>
                                    </div>
                                </div>

                                <div class="stat-item">
                                    <div class="stat-header">
                                        <p class="stat-name"> Средний </p>
                                        <p class="stat-numbers"> 3 шт. </p>
                                    </div>
                                    <div class="stat-progress-wrapper">
                                        <v-progress-linear 
                                            model-value="33" 
                                            color="secondary" 
                                            height="8" 
                                            rounded 
                                        />
                                        <p class="stat-percent text-secondary"> 33% </p>
                                    </div>
                                </div>

                                <div class="stat-item">
                                    <div class="stat-header">
                                        <p class="stat-name"> Низкий </p>
                                        <p class="stat-numbers"> 2 шт. </p>
                                    </div>
                                    <div class="stat-progress-wrapper">
                                        <v-progress-linear 
                                            model-value="22" 
                                            color="secondary" 
                                            height="8" 
                                            rounded 
                                        />
                                        <p class="stat-percent text-secondary"> 22% </p>
                                    </div>
                                </div>
                            </div>
                        </v-card>
                    </section>

                    <section class="managers-statistics">
                        <v-card color="surface" rounded="xl" class="managers-card">
                            <div class="maneger-header">
                                <div class="maneger-headder-title">
                                    <v-icon icon="mdi-account-group-outline" size="30" color="secondary" class="mr-3"/>
                                    <h2> Эффективность сотрудников </h2>
                                </div>
                                <div>
                                    <v-text-field
                                        density="compact"
                                        variant="outlined"
                                        label="Поиск сотрудника"
                                        hide-details
                                        rounded="lg"
                                        prepend-inner-icon="mdi-magnify"
                                        color="primary"
                                        style="width: 280px;"
                                    />
                                </div>
                            </div>

                            <div class="managers">
                                <div class="manager-card-row">
                                    <div class="manager-main">
                                        <v-avatar color="primary" variant="tonal" size="48" class="mr-4" rounded="xl">
                                            <p class="text-h6 font-weight-bold"> ИП </p>
                                        </v-avatar>
                                        <div>
                                            <p class="manager-name"> Иван Петров </p>
                                            <p class="manager-role"> Ответственный</p>
                                        </div>
                                    </div>
                                    
                                    <div class="manager-middle">
                                        <div class="performance-info">
                                            <p class="performance-label"> Эффективность </p>
                                            <p class="performance-value text-primary"> 75% </p>
                                        </div>
                                        <v-progress-linear 
                                            model-value="75" 
                                            color="primary" 
                                            height="8" 
                                            rounded 
                                            />
                                    </div>

                                    <div class="manager-stats">
                                        <div class="stat-container">
                                            <p class="stat-container-number"> 5 </p>
                                            <p class="stat-container-status"> В работе </p>
                                        </div>

                                        <div class="vertical-divider"></div>
                                        
                                        <div class="stat-container">
                                            <p class="stat-container-number text-primary"> 15 </p>
                                            <p class="stat-container-status"> Закрыто </p>
                                        </div>
                                    </div>
                                </div>

                                <div class="manager-card-row">
                                    <div class="manager-main">
                                        <v-avatar color="secondary" variant="tonal" size="48" class="mr-4" rounded="xl">
                                            <p class="text-h6 font-weight-bold"> ОП </p>
                                        </v-avatar>
                                        <div>
                                            <p class="manager-name"> Олег Пуговкин </p>
                                            <p class="manager-role"> Ответственный</p>
                                        </div>
                                    </div>
                                    
                                    <div class="manager-middle">
                                        <div class="performance-info">
                                            <p class="performance-label"> Эффективность </p>
                                            <p class="performance-value text-secondary"> 38% </p>
                                        </div>
                                        <v-progress-linear 
                                            model-value="38" 
                                            color="secondary" 
                                            height="8" 
                                            rounded 
                                            />
                                    </div>

                                    <div class="manager-stats">
                                        <div class="stat-container">
                                            <p class="stat-container-number"> 6 </p>
                                            <p class="stat-container-status"> В работе </p>
                                        </div>

                                        <div class="vertical-divider"></div>
                                        
                                        <div class="stat-container">
                                            <p class="stat-container-number text-primary"> 4 </p>
                                            <p class="stat-container-status"> Закрыто </p>
                                        </div>
                                    </div>
                                </div>

                                <div class="manager-card-row">
                                    <div class="manager-main">
                                        <v-avatar color="secondary" variant="tonal" size="48" class="mr-4" rounded="xl">
                                            <p class="text-h6 font-weight-bold"> ОП </p>
                                        </v-avatar>
                                        <div>
                                            <p class="manager-name"> Анна Олеговна </p>
                                            <p class="manager-role"> Ответственный</p>
                                        </div>
                                    </div>
                                    
                                    <div class="manager-middle">
                                        <div class="performance-info">
                                            <p class="performance-label"> Эффективность </p>
                                            <p class="performance-value text-secondary"> 12% </p>
                                        </div>
                                        <v-progress-linear 
                                            model-value="12" 
                                            color="secondary" 
                                            height="8" 
                                            rounded 
                                            />
                                    </div>

                                    <div class="manager-stats">
                                        <div class="stat-container">
                                            <p class="stat-container-number"> 8 </p>
                                            <p class="stat-container-status"> В работе </p>
                                        </div>

                                        <div class="vertical-divider"></div>
                                        
                                        <div class="stat-container">
                                            <p class="stat-container-number text-primary"> 1 </p>
                                            <p class="stat-container-status"> Закрыто </p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </v-card>
                    </section>
                </main>
            </div>
        </transition>
    </div> 
</template>
<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
const router = useRouter();

const loading = ref(true);

onMounted(() => {
    setTimeout(() => {
        loading.value = false;
    }, 1000);
})

const totalDefects = 20;
const efficiency = '22%';
const overdue = 3;
const activeProjects = 4;

const byStatus = [
    { name: 'Новая', count: 3, percent: 61 },
    { name: 'В работе', count: 2, percent: 78 },
    { name: 'На проверке', count: 1, percent: 11 },
    { name: 'Закрыта / Отмена', count: 3, percent: 33 },
]

const byPriority = [
    { name: 'Высокий', count: 4, percent: 54 },
    { name: 'Средний', count: 3, percent: 33 },
    { name: 'Низкий', count: 2, percent: 22 },
]

const managers = [
    { initials: 'ИП', name: 'Иван Петров', role: 'Ответственный', perf: 75, inWork: 5, closed: 15 },
    { initials: 'ОП', name: 'Олег Пуговкин', role: 'Ответственный', perf: 38, inWork: 6, closed: 4 },
    { initials: 'АО', name: 'Анна Олеговна', role: 'Ответственный', perf: 12, inWork: 8, closed: 1 },
]

const esc = (v) => {
    const s = String(v ?? '')
    if (/[;"\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`
    return s
}

const buildCsv = () => {
    const sep = ';'
    const rows = []

    const today = new Date()
    const date = today.toISOString().slice(0, 10)

    rows.push(['Отчет', 'Аналитика и отчетность'])
    rows.push(['Дата', date])
    rows.push([])

    rows.push(['KPI', 'Значение'])
    rows.push(['Всего дефектов', totalDefects])
    rows.push(['Эффективность', efficiency])
    rows.push(['Просрочено', overdue])
    rows.push(['Активных проектов', activeProjects])
    rows.push([])

    rows.push(['Дефекты по статусам'])
    rows.push(['Статус', 'Кол-во', 'Процент'])
    byStatus.forEach(i => rows.push([i.name, i.count, `${i.percent}%`]))
    rows.push([])

    rows.push(['Приоритетность'])
    rows.push(['Приоритет', 'Кол-во', 'Процент'])
    byPriority.forEach(i => rows.push([i.name, i.count, `${i.percent}%`]))
    rows.push([])

    rows.push(['Эффективность сотрудников'])
    rows.push(['ФИО', 'Роль', 'Эффективность', 'В работе', 'Закрыто'])
    managers.forEach(m => rows.push([m.name, m.role, `${m.perf}%`, m.inWork, m.closed]))

    const csv = '\uFEFF' + rows
        .map(r => r.map(esc).join(sep))
        .join('\r\n')

    return csv
}

const downloadReportCsv = () => {
    const csv = buildCsv()
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = `report_${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(a)
    a.click()
    a.remove()

    URL.revokeObjectURL(url)
}

</script>
<style scoped>
.report-page {
    min-height: 100vh;
    background-color: rgb(var(--v-theme-background));
    color: rgb(var(--v-theme-on-background));
    display: flex;
    justify-content: center;
    padding: 32px 16px 64px;


}

.report-wrapper {
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
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 14px;
    background-color: rgba(var(--v-theme-surface), 0.9);

    
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
.header-buttons {
    display: flex;
    gap: 10px;
}

/* карточки */
.stat-cards {
    display: flex;
    gap: 16px;
}

.stat-card {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 20px;
    border: 1px solid rgba(255, 255, 255, 0.06);
    background-color: rgba(var(--v-theme-surface), 0.9);
    transition: all 0.4s ease-out;
}

.stat-card:hover {
    transform: translateY(-4px);
    border-color: rgba(var(--v-theme-primary), 0.2);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}


.color-primary {
    background-color: rgba(var(--v-theme-primary), 0.12);
}
.color-secondary {
    background-color: rgba(var(--v-theme-secondary), 0.12);
}

.stat-value {
    font-size: 28px;
    font-weight: 700;
    line-height: 1;
    margin-bottom: 4px;
}
.stat-label {
    font-size: 14px;
    font-weight: 500;
    color: rgb(var(--v-theme-secondary));
    opacity: 0.9;
}

/* мэйн*/
main {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.charts-container {
    display: flex;
    gap: 20px;
    width: 100%;
}

.chart-card {
    flex: 1; 
    padding: 20px;
    border: 1px solid rgba(255, 255, 255, 0.06);
    background-color: rgba(var(--v-theme-surface), 0.9);
    display: flex;
    flex-direction: column;
}

.card-title {
    display: flex;
    align-items: center;
}
.card-title h2 {
    font-size: 24px;
    font-weight: 700;
}

.stats-list {
    display: flex;
    flex-direction: column;
    gap: 12px; 
}

.stat-item {
    border-radius: 12px;
    padding: 8px 16px;
    border: 1px solid rgba(255, 255, 255, 0.06);
    transition: all 0.4s ease-out;
}
.stat-item:hover {
    transform: translateY(-2px);
    border-color: rgba(var(--v-theme-primary), 0.2);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}
.stat-header {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
}
.stat-name {
    font-weight: 600;
    font-size: 16px;
    color: rgb(var(--v-theme-on-surface));
}
.stat-numbers {
    color: rgb(var(--v-theme-secondary));
    font-weight: 500;
    font-size: 14px;
}

.stat-progress-wrapper {
    display: flex;
    align-items: center;
    gap: 12px;
}

.stat-percent {
    font-size: 13px;
    font-weight: 700;
    min-width: 32px;
    text-align: right;
}


/* менеджеры */
.managers-statistics {
    width: 100%;
}

.managers-card {
    width: 100%;
    padding: 20px;
    border: 1px solid rgba(255, 255, 255, 0.06);
    background-color: rgba(var(--v-theme-surface), 0.9);
}

.maneger-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}
.maneger-headder-title {
    display: flex;
    align-items: center;
}
.card-header-row h2 {
    font-size: 20px;
    font-weight: 700;
    margin: 0;
}

.managers {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.manager-card-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 24px;
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 16px;
    transition: all 0.4s ease-out;
}
.manager-card-row:hover {
    transform: translateY(-2px);
    border-color: rgba(var(--v-theme-primary), 0.2);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.manager-main {
    flex: 2;
    display: flex;
    align-items: center;
    min-width: 200px;
}
.manager-name {
    font-size: 16px;
    font-weight: 600;
    line-height: 1.2;
}
.manager-role {
    font-size: 13px;
    color: rgb(var(--v-theme-secondary));
    margin-top: 4px;
}

.manager-middle {
    flex: 3;
    padding: 0 40px;
    display: flex;
    flex-direction: column;
    gap: 6px;
}
.performance-info {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    margin-bottom: 2px;
}
.performance-label {
    color: rgb(var(--v-theme-secondary));
    font-weight: 500;
}
.performance-value {
    font-weight: 700;
}

.manager-stats {
    flex: 1.5;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 20px;
}

.stat-container {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.stat-container-number {
    font-size: 18px;
    font-weight: 700;
    line-height: 1.2;
}
.stat-container-status {
    font-size: 11px;
    color: rgb(var(--v-theme-secondary));
    font-weight: 500;
}

.vertical-divider {
    width: 2px;
    height: 24px;
    background-color: rgba(255, 255, 255, 0.2);
}

:deep(.v-btn) {
    transition: transform 0.4s ease-out;
}
:deep(.v-btn:active) {
    transform: scale(0.94);
}

.text-primary { 
    color: rgb(var(--v-theme-primary)); }
.text-secondary { 
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
</style>