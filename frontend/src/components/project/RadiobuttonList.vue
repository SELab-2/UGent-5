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
                v-model="radio_date"
                label="Group Selection Deadline"
            ></DatePicker>
            <v-text-field
                v-model="capacity"
                label="Capacity"
                type="number"
                min="1"
            ></v-text-field>
        </v-container>
    </v-card>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import DatePicker from "./DatePicker.vue";

interface RadioButtonOption {
    label: string;
    value: string;
}

const props = defineProps<{
    title: string;
    options: RadioButtonOption[];
}>();

const isToggled = ref(true);
const selectedOption = ref("");
const radio_date = ref<Date | null>(null);
const capacity = ref(1); // Default capacity

const emit = defineEmits<{
    (e: "update:radio_date", value: Date | null): void;
    (e: "update:capacity", value: number): void;
    (e: "update:selectedOption", value: string): void;
}>();

watch(selectedOption, (newValue) => {
    if (newValue === "student") {
        radio_date.value = new Date();
    }
    else{
        radio_date.value = null;
    }
    emit("update:selectedOption", newValue);
});

watch(radio_date, (newVal) => {
    emit("update:radio_date", newVal);
});

watch(isToggled, (newValue) => {
    if (!newValue) {
        capacity.value = 1;
        radio_date.value = null;
        emit("update:capacity", capacity.value);
    }
});

watch(capacity, (newValue) => {
    if (isToggled.value) {
        emit("update:capacity", newValue);
    }
});
</script>
