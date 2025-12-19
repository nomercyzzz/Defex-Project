<template>
    <v-dialog 
        :model-value="modelValue" 
        @update:model-value="$emit('update:modelValue', $event)" 
        max-width="540px" 
        persistent
        transition="fade-scale"
        scrim="black"
    >
        <v-card color="surface" rounded="xl" class="pa-2 border-thin" elevation="0">
            <v-card-title class="d-flex align-center pt-4 px-4">
                <v-icon icon="mdi-plus" color="primary" class="mr-3" />
                <span class="text-h6 font-weight-bold">Новый проект</span>
            </v-card-title>

            <v-card-text class="pt-4">
                <v-form ref="form" @submit.prevent="save">
                    <v-row dense>
                        <v-col cols="12" sm="4">
                            <v-text-field 
                                v-model="item.code" 
                                label="Код" 
                                placeholder="Напр. PR-01"
                                variant="outlined" 
                                density="comfortable" 
                                rounded="lg" 
                                color="primary" 
                                base-color="secondary"
                                hide-details
                            />
                        </v-col>
                        <v-col cols="12" sm="8">
                            <v-text-field 
                                v-model="item.name" 
                                label="Название проекта" 
                                variant="outlined" 
                                density="comfortable" 
                                rounded="lg" 
                                color="primary"
                                base-color="secondary" 
                                hide-details
                            />
                        </v-col>

                        <v-col cols="12">
                            <v-text-field 
                                v-model="item.stage" 
                                label="Текущий этап работ" 
                                variant="outlined" 
                                density="comfortable" 
                                rounded="lg" 
                                color="primary"
                                base-color="secondary" 
                                hide-details
                            />
                        </v-col>

                        <v-col cols="12" sm="6">
                            <v-select 
                                v-model="item.status" 
                                :items="statusOptions" 
                                label="Статус" 
                                variant="outlined" 
                                density="comfortable" 
                                rounded="lg" 
                                color="primary"
                                base-color="secondary" 
                                hide-details
                                prepend-inner-icon="mdi-list-status"
                            />
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-select 
                                v-model="item.priority" 
                                :items="priorityOptions" 
                                label="Приоритет" 
                                variant="outlined" 
                                density="comfortable" 
                                rounded="lg" 
                                color="primary"
                                base-color="secondary" 
                                hide-details
                                prepend-inner-icon="mdi-flag-outline"
                            />
                        </v-col>

                        <v-col cols="12" sm="6">
                            <v-text-field 
                                v-model="item.manager" 
                                label="Ответственный" 
                                variant="outlined" 
                                density="comfortable" 
                                rounded="lg" 
                                color="primary"
                                base-color="secondary" 
                                hide-details
                                prepend-inner-icon="mdi-account-outline"
                            />
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-text-field 
                                v-model="item.deadline" 
                                type="date" 
                                label="Срок сдачи" 
                                variant="outlined" 
                                density="comfortable" 
                                rounded="lg" 
                                color="primary"
                                base-color="secondary" 
                                hide-details
                            />
                        </v-col>

                        <v-col cols="12">
                            <v-text-field 
                                v-model="item.location" 
                                label="Адрес / Локация" 
                                variant="outlined" 
                                density="comfortable" 
                                rounded="lg" 
                                color="primary"
                                base-color="secondary" 
                                hide-details
                                prepend-inner-icon="mdi-map-marker-outline"
                            />
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>

            <v-card-actions class="px-4 pb-4">
                <v-spacer />
                <v-btn 
                    color="secondary" 
                    variant="text" 
                    rounded="lg"
                    class="mr-2"
                    @click="$emit('update:modelValue', false)"
                >
                    Отмена
                </v-btn>
                <v-btn 
                    color="primary" 
                    variant="flat" 
                    rounded="lg" 
                    class="px-6"
                    :loading="loading" 
                    @click="save"
                >
                    Создать
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps(['modelValue', 'loading'])
const emit = defineEmits(['update:modelValue', 'save'])

const statusOptions = ['Новая', 'В работе', 'На проверке', 'Закрыта / Отмена']
const priorityOptions = ['Высокий', 'Средний', 'Низкий']

const defaultItem = { code: '', name: '', stage: '', status: 'Новая', priority: 'Средний', manager: '', location: '', deadline: '' }
const item = ref({ ...defaultItem })

watch(() => props.modelValue, (val) => {
    if (val) item.value = { ...defaultItem } 
})

const save = () => {
    if (!item.value.code || !item.value.name) return
    emit('save', item.value)
}
</script>

<style>

.fade-scale-enter-active,
.fade-scale-leave-active {
    transition: opacity 0.4s ease-out, transform 0.4s ease-out;
}

.fade-scale-enter-from,
.fade-scale-leave-to {
    opacity: 0;
    transform: scale(0.92);
}
</style>