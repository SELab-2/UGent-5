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
                @input="handleCapacityInput"
            ></v-text-field>
        </v-container>
    </v-card>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from "vue";
import DatePicker from "./DatePicker.vue";
import type { Optional } from "@tanstack/vue-query";

const props = defineProps<{
    title: string;
    options: string[];
    initialDate: Optional<Date>;
    initialCapacity: number;
}>();

const isToggled = ref(false);
const selectedOption = ref("");
const enrollDate = ref(props.initialDate || new Date());
const capacity = ref(props.initialCapacity);

const emit = defineEmits(["update:date", "update:capacity", "update:selectedOption"]);

// Reset capacity to 1 when toggle is deactivated, and reset to 2 and change selection when activated
watch(isToggled, (newVal) => {
    if (!newVal) {
        capacity.value = 1;
        emit("update:capacity", capacity.value);
    } else {
        selectedOption.value = "random";
        capacity.value = 2;
        emit("update:selectedOption", selectedOption.value);
        emit("update:capacity", capacity.value);
    }
});

watch(selectedOption, (newVal) => {
    emit("update:selectedOption", newVal);
});

function handleDateChange(value: Date) {
    emit("update:date", value);
}

function handleCapacityInput(event: Event) {
    const newCapacity = Number((event.target as HTMLInputElement).value);
    if (newCapacity < 2) {
        event.preventDefault(); // Prevent the field from updating
        capacity.value = 2; // Enforce minimum capacity of 2 when manually changed
    } else {
        capacity.value = newCapacity; // Allow the update if it's 2 or greater
    }
    emit("update:capacity", capacity.value);
}
</script>
