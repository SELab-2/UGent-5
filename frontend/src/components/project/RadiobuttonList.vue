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
            <!-- Numeric input for Capacity -->
            <v-text-field
                v-if="selectedOption === 'student' || selectedOption === 'random'"
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
import DatePicker from "./DatePicker.vue"; // Import your custom DatePicker component

interface RadioButtonOption {
    label: string;
    value: string;
}

const model = defineModel<string>({});

defineProps<{
    title: string;
    options: RadioButtonOption[];
}>();

const isToggled = ref(true);
const selectedOption = ref(model);
const radio_date = ref(new Date());
const capacity = ref(1); // Default capacity

const emit = defineEmits<{
    (e: "update:radio_date", value: Date): void;
    (e: "update:capacity", value: number): void;
}>();

watch(capacity, (newCapacity) => {
    emit("update:capacity", newCapacity);
});

watch(selectedOption, (newValue) => {
    if (newValue === "course") {
        capacity.value = 1; // Reset capacity when 'student' is not selected
        emit("update:capacity", capacity.value);
    }
});
</script>
