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
                <span class="text-h6 font-weight-bold">Новый дефект</span>
            </v-card-title>

            <v-card-text class="pt-4">
                <v-form ref="form" @submit.prevent="save">
                    <v-row dense>
                        <v-col cols="12" sm="6">
                            <v-text-field 
                                v-model="item.id" 
                                label="Код" 
                                placeholder="Напр. DEF-01"
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
                                :items="['Новая', 'В работе', 'На проверке', 'Закрыта / Отмена']" 
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

                        <v-col cols="12">
                            <v-text-field 
                                v-model="item.title" 
                                label="Описание проблемы" 
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
                        
                        <v-col cols="12" sm="6">
                            <v-select 
                                v-model="item.priority" 
                                :items="['Высокий', 'Средний', 'Низкий']" 
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
                                v-model="item.deadline" 
                                type="date" 
                                label="Срок устранения" 
                                variant="outlined" 
                                density="comfortable" 
                                rounded="lg" 
                                color="primary" 
                                base-color="secondary"
                                hide-details
                            />
                        </v-col>

                        <v-col cols="12" sm="6">
                            <v-text-field 
                                v-model="item.responsible" 
                                label="Ответственный" 
                                variant="outlined" 
                                density="comfortable" 
                                rounded="lg" 
                                color="primary" 
                                base-color="secondary"
                                hide-details
                                prepend-inner-icon="mdi-account-hard-hat-outline"
                            />
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-text-field 
                                v-model="item.author" 
                                label="Автор" 
                                variant="outlined" 
                                density="comfortable" 
                                rounded="lg" 
                                color="primary" 
                                base-color="secondary"
                                hide-details
                                prepend-inner-icon="mdi-account-edit-outline"
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