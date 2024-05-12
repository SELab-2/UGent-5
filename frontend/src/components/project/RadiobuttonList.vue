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
const radio_date = ref<Date | null>(null);
const capacity = ref(1); // Default capacity

const emit = defineEmits<{
    (e: "update:radio_date", value: Date | null): void;
    (e: "update:capacity", value: number): void;
}>();

watch(selectedOption, (newValue) => {
    if (newValue === "student") {
        // Ensure radio_date can be set
        radio_date.value = new Date(); // or keep the existing date
    } else {
        // Reset radio_date when 'student' is not selected
        radio_date.value = null;
    }
    emit("update:radio_date", radio_date.value);

    // Adjust capacity based on the selected option
    if (newValue !== "student" && newValue !== "random") {
        capacity.value = 1; // Reset capacity
    }
    emit("update:capacity", capacity.value);
});
</script>
