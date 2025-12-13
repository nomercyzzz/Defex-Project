<template>
    <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" max-width="600px" persistent>
        <v-card rounded="xl" class="pa-4">
            <v-card-title class="text-h5 font-weight-bold">Редактирование дефекта</v-card-title>
            <v-card-text>
                <v-form ref="form" @submit.prevent="save">
                    <v-container class="pa-0">
                        <v-row>
                            <v-col cols="12" sm="6">
                                <v-text-field 
                                    v-model="item.id" 
                                    label="Код" 
                                    variant="outlined" 
                                    density="comfortable" 
                                    rounded="lg" 
                                    color="primary"
                                    :readonly="!canFullEdit"
                                />
                            </v-col>

                            <v-col cols="12" sm="6">
                                <v-select 
                                    v-model="item.status" 
                                    :items="['Новая', 'В работе', 'На проверке', 'Закрыта / Отмена']" 
                                    label="Статус" 
                                    variant="outlined" 
                                    density="comfortable" 
                                    rounded="lg" 
                                    color="primary" 
                                    :disabled="!canEditStatus"
                                />
                            </v-col>

                            <v-col cols="12">
                                <v-text-field 
                                    v-model="item.title" 
                                    label="Описание проблемы" 
                                    variant="outlined" 
                                    density="comfortable" 
                                    rounded="lg" 
                                    color="primary" 
                                    :readonly="!canFullEdit"
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
                                    :readonly="!canFullEdit"
                                />
                            </v-col>

                            <v-col cols="12" sm="6">
                                <v-select 
                                    v-model="item.priority" 
                                    :items="['Высокий', 'Средний', 'Низкий']" 
                                    label="Приоритет" 
                                    variant="outlined" 
                                    density="comfortable" 
                                    rounded="lg" 
                                    color="primary" 
                                    :readonly="!authStore.isManager"
                                />
                            </v-col>
                            
                            <v-col cols="12" sm="6">
                                <v-text-field v-model="item.responsible" label="Ответственный" variant="outlined" density="comfortable" rounded="lg" color="primary" :readonly="!authStore.isManager" />
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-text-field v-model="item.author" label="Автор" variant="outlined" density="comfortable" rounded="lg" color="primary" :readonly="!authStore.isManager" />
                            </v-col>

                            <v-col cols="12" sm="6">
                                <v-text-field 
                                    v-model="item.deadline" 
                                    type="date" 
                                    label="Крайний срок" 
                                    variant="outlined" 
                                    density="comfortable" 
                                    rounded="lg" 
                                    color="primary" 
                                    :readonly="!canFullEdit"
                                />
                            </v-col>
                        </v-row>
                    </v-container>
                </v-form>
            </v-card-text>
            <v-card-actions class="justify-space-between">
                <v-btn 
                    :readonly="!canFullEdit"
                    color="error" 
                    variant="text" 
                    prepend-icon="mdi-delete" 
                    @click="$emit('delete', item._id)"
                    >
                        Удалить
                    </v-btn>

                <div>
                    <v-btn color="secondary" variant="text" @click="$emit('update:modelValue', false)">Отмена</v-btn>
                    <v-btn color="primary" variant="elevated" rounded="lg" :loading="loading" @click="save">Сохранить</v-btn>
                </div>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useAuthStore } from '../store/auth.js'

const props = defineProps(['modelValue', 'defect', 'loading'])
const emit = defineEmits(['update:modelValue', 'save', 'delete'])


const authStore = useAuthStore()

const canFullEdit = computed(() => authStore.isManager)
const canEditStatus = computed(() => authStore.isManager || authStore.isEngineer)

const item = ref({})

watch(() => props.modelValue, (val) => {
    if (val && props.defect) {
        item.value = { ...props.defect }
    }
})

const save = () => emit('save', item.value)
</script>