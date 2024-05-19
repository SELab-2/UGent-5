<template>
    <v-card class="radio-button-list">
        <v-switch v-model="isToggled" :label="title" class="header"></v-switch>
        <v-container v-if="isToggled">
            <v-radio-group v-model="selectedOption" column>
                <v-radio
                    v-for="option in options"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                ></v-radio>
            </v-radio-group>
            <DatePicker
                v-if="selectedOption === 'student'"
                :modelValue="enrollDate"
                @update:modelValue="handleDateChange"
                label="Deadline"
            />
            <v-text-field
                v-model="capacity"
                :label="$t('project.capacity_group')"
                type="number"
                min="1"
            ></v-text-field>
        </v-container>
    </v-card>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from "vue";
import DatePicker from "./DatePicker.vue";

const props = defineProps({
    title: String,
    options: Array,
    initialDate: Date,
    initialCapacity: Number,
});

const isToggled = ref(true);
const selectedOption = ref("");
const enrollDate = ref(props.initialDate || new Date());
const capacity = ref(props.initialCapacity);

const emit = defineEmits(["update:date", "update:capacity", "update:selectedOption"]);
//
function handleDateChange(value: Date) {
    emit("update:date", value);
}

function handleCapacityChange(value: Number) {
    emit("update:capacity", value);
}

function handleOptionChange(value: string) {
    emit("update:selectedOption", value);
}
</script>
