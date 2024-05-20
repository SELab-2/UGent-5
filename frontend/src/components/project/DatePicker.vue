<template>
    <v-menu
        v-model="menuVisible"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        full-width
    >
        <template v-slot:activator>
            <v-text-field
                v-model="displayDate"
                :label="label"
                readonly
                v-bind="$attrs"
                @click="toggleDatePicker"
            ></v-text-field>
        </template>
        <v-date-picker v-model="date" no-title></v-date-picker>
        <v-time-picker v-model="time" format="24hr"></v-time-picker>
    </v-menu>
</template>

<script setup lang="ts">
import { ref, watch, computed, defineEmits } from "vue";
import { VTimePicker } from "vuetify/labs/VTimePicker";

// Define props and emits
const props = defineProps<{
    modelValue: Date; // This expects a JavaScript Date object
    label: string;
}>();
const emit = defineEmits(["update:modelValue"]);

const menuVisible = ref<boolean>(false);
const date = ref<Date>(new Date(props.modelValue || Date.now())); // Initialize with current date or modelValue
const time = ref<string>(formatTime(props.modelValue || new Date())); // Initialize with current time or modelValue

// Watcher to sync changes in modelValue to date and time pickers
watch(
    () => props.modelValue,
    (newValue, oldValue) => {
        if (newValue && newValue !== oldValue) {
            date.value = new Date(newValue); // Update the date picker
            time.value = formatTime(new Date(newValue)); // Update the time picker
        }
    },
    { immediate: true, deep: true }
);

// Format time into a string
function formatTime(date: Date): string {
    return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
}

// Watcher to emit updates when date or time changes
watch(
    [date, time],
    () => {
        const [hours, minutes] = time.value.split(":").map(Number);
        const updatedDate = new Date(date.value);
        updatedDate.setHours(hours, minutes, 0, 0); // Apply time changes to the date
        emit("update:modelValue", new Date(updatedDate)); // Emit the updated Date object
    },
    { deep: true }
);

// Computed property to display date and time in text field
const displayDate = computed(() => {
    if (date.value && time.value) {
        const selectedDate = new Date(date.value);
        const [hours, minutes] = time.value.split(":").map(Number);
        selectedDate.setHours(hours, minutes);
        return `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1).toString().padStart(2, "0")}-${selectedDate.getDate().toString().padStart(2, "0")} ${selectedDate.getHours().toString().padStart(2, "0")}:${selectedDate.getMinutes().toString().padStart(2, "0")}`;
    }
    return "";
});

// Toggle visibility of date/time picker
function toggleDatePicker() {
    menuVisible.value = !menuVisible.value;
}
</script>
