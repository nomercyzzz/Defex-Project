<template>
    <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" max-width="600px" persistent>
        <v-card rounded="xl" class="pa-4">
            <v-card-title class="text-h5 font-weight-bold">Новый проект</v-card-title>
            <v-card-text>
                <v-form ref="form" @submit.prevent="save">
                    <v-container class="pa-0">
                        <v-row>
                        <v-col cols="12" sm="6"><v-text-field v-model="item.code" label="Код" variant="outlined" density="comfortable" rounded="lg" color="primary" /></v-col>
                        <v-col cols="12" sm="6"><v-text-field v-model="item.name" label="Название" variant="outlined" density="comfortable" rounded="lg" color="primary" /></v-col>
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
            <v-card-actions>
                <v-spacer />
                <v-btn color="secondary" variant="text" @click="$emit('update:modelValue', false)">Отмена</v-btn>
                <v-btn color="primary" variant="elevated" rounded="lg" :loading="loading" @click="save">Сохранить</v-btn>
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
    // сбрасывем форму при открытии диалоога 
    if (val) item.value = { ...defaultItem } 
})

const save = () => {
    if (!item.value.code || !item.value.name) return
    emit('save', item.value)
}
</script>