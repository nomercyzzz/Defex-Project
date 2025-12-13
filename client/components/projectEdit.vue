<template>
    <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" max-width="600px" persistent>
        <v-card rounded="xl" class="pa-4">
            <v-card-title class="text-h5 font-weight-bold">Редактирование проекта</v-card-title>
                <v-card-text>
                    <v-form ref="form" @submit.prevent="save">
                    <v-container class="pa-0">
                        <v-row>
                        <v-col cols="12" sm="6"><v-text-field v-model="item.code" label="Код" variant="outlined" density="comfortable" rounded="lg" color="primary" readonly /></v-col> <v-col cols="12" sm="6"><v-text-field v-model="item.name" label="Название" variant="outlined" density="comfortable" rounded="lg" color="primary" /></v-col>
                        <v-col cols="12"><v-text-field v-model="item.stage" label="Этап" variant="outlined" density="comfortable" rounded="lg" color="primary" /></v-col>
                        <v-col cols="12" sm="6"><v-select v-model="item.status" :items="statusOptions" label="Статус" variant="outlined" density="comfortable" rounded="lg" color="primary" /></v-col>
                        <v-col cols="12" sm="6"><v-select v-model="item.priority" :items="priorityOptions" label="Приоритет" variant="outlined" density="comfortable" rounded="lg" color="primary" /></v-col>
                        <v-col cols="12" sm="6"><v-text-field v-model="item.manager" label="Ответственный" variant="outlined" density="comfortable" rounded="lg" color="primary" /></v-col>
                        <v-col cols="12" sm="6"><v-text-field v-model="item.deadline" type="date" label="Срок" variant="outlined" density="comfortable" rounded="lg" color="primary" /></v-col>
                        <v-col cols="12"><v-text-field v-model="item.location" label="Локация" variant="outlined" density="comfortable" rounded="lg" color="primary" /></v-col>
                        </v-row>
                    </v-container>
                </v-form>
            </v-card-text>
            <v-card-actions class="justify-space-between">
                <v-btn color="error" variant="text" prepend-icon="mdi-delete" @click="$emit('delete', item.code)">Удалить</v-btn>
                <div>
                    <v-btn color="secondary" variant="text" @click="$emit('update:modelValue', false)">Отмена</v-btn>
                    <v-btn color="primary" variant="elevated" rounded="lg" :loading="loading" @click="save">Сохранить</v-btn>
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
        // запоняем форму при открытии далога 
        item.value = { ...props.project }
    }
})

const save = () => emit('save', item.value)
</script>