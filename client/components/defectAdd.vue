    <template>
        <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" max-width="600px" persistent>
            <v-card rounded="xl" class="pa-4">
                <v-card-title class="text-h5 font-weight-bold">Новый дефект</v-card-title>
                <v-card-text>
                    <v-form ref="form" @submit.prevent="save">
                        <v-container class="pa-0">
                            <v-row>
                                <v-col cols="12" sm="6">
                                    <v-text-field 
                                        v-model="item.id" 
                                        label="Код (например, DF-001)" 
                                        variant="outlined" 
                                        density="comfortable" 
                                        rounded="lg" 
                                        color="primary"
                                    />
                                </v-col>
                                
                                <v-col cols="12" sm="6">
                                    <v-select v-model="item.status" :items="['Новая', 'В работе', 'На проверке', 'Закрыта / Отмена']" label="Статус" variant="outlined" density="comfortable" rounded="lg" color="primary" />
                                </v-col>

                                <v-col cols="12"><v-text-field v-model="item.title" label="Описание проблемы" variant="outlined" density="comfortable" rounded="lg" color="primary" /></v-col>
                                <v-col cols="12"><v-text-field v-model="item.location" label="Локация" variant="outlined" density="comfortable" rounded="lg" color="primary" /></v-col>
                                
                                <v-col cols="12" sm="6">
                                    <v-select v-model="item.priority" :items="['Высокий', 'Средний', 'Низкий']" label="Приоритет" variant="outlined" density="comfortable" rounded="lg" color="primary" />
                                </v-col>
                                
                                <v-col cols="12" sm="6"><v-text-field v-model="item.responsible" label="Ответственный" variant="outlined" density="comfortable" rounded="lg" color="primary" /></v-col>
                                <v-col cols="12" sm="6"><v-text-field v-model="item.author" label="Автор" variant="outlined" density="comfortable" rounded="lg" color="primary" /></v-col>
                                
                                <v-col cols="12" sm="6"><v-text-field v-model="item.deadline" type="date" label="Срок" variant="outlined" density="comfortable" rounded="lg" color="primary" /></v-col>
                            </v-row>
                        </v-container>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn color="secondary" variant="text" @click="$emit('update:modelValue', false)">Отмена</v-btn>
                    <v-btn color="primary" variant="elevated" rounded="lg" :loading="loading" @click="save">Создать</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </template>

    <script setup>
    import { ref, watch } from 'vue'

    const props = defineProps(['modelValue', 'loading'])
    const emit = defineEmits(['update:modelValue', 'save'])

    const defaultItem = { id: '', title: '', location: '', status: 'Новая', priority: 'Средний', responsible: '', author: '', deadline: '' }
    const item = ref({ ...defaultItem })

    watch(() => props.modelValue, (val) => {
        if (val) item.value = { ...defaultItem } 
    })

    const save = () => {
        if (!item.value.id || !item.value.title) return
        emit('save', item.value)
    }
    </script>