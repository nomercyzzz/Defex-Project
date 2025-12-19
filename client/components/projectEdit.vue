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
                <v-icon icon="mdi-pencil-outline" color="primary" class="mr-3" />
                <span class="text-h6 font-weight-bold">Редактирование</span>
            </v-card-title>

            <v-card-text class="pt-4">
                <v-form ref="form" @submit.prevent="save">
                    <v-row dense>
                        <v-col cols="12" sm="4">
                            <v-text-field 
                                v-model="item.code" 
                                label="Код" 
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
                                label="Этап" 
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
                                label="Срок" 
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
                                label="Локация" 
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

            <v-card-actions class="px-4 pb-4 d-flex justify-space-between">
                <v-btn 
                    color="secondary" 
                    variant="tonal" 
                    rounded="lg"
                    class="px-4"
                    prepend-icon="mdi-delete-outline"
                    @click="$emit('delete', item.code)"
                >
                    Удалить
                </v-btn>

                <div>
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
                        Сохранить
                    </v-btn>
                </div>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps(['modelValue', 'project', 'loading'])
const emit = defineEmits(['update:modelValue', 'save', 'delete'])

const statusOptions = ['Новая', 'В работе', 'На проверке', 'Закрыта / Отмена']
const priorityOptions = ['Высокий', 'Средний', 'Низкий']

const item = ref({})

watch(() => props.modelValue, (val) => {
    if (val && props.project) {
        item.value = { ...props.project }
    }
})

const save = () => emit('save', item.value)
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