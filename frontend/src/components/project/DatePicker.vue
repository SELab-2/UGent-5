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
import { ref, watch, computed, defineProps, defineEmits } from "vue";
import { VTimePicker } from "vuetify/labs/VTimePicker";

// Define props and emits
const props = defineProps<{
    modelValue: Date;
    label: string;
}>();
const emit = defineEmits(["update:modelValue"]);

// Local reactive state for date and time
const menuVisible = ref(false);
const date = ref(props.modelValue || new Date()); // defaulting to a new Date if modelValue isn't provided
const time = ref(formatTime(props.modelValue || new Date()));

function formatTime(date: Date): string {
    return `${date.getHours()}:${date.getMinutes()}`;
}

watch(
    [date, time],
    () => {
        const [hours, minutes] = time.value.split(":").map(Number);
        const localDate = new Date(date.value);
        localDate.setHours(hours);
        localDate.setMinutes(minutes);
        emit("update:modelValue", new Date(localDate));
    },
    { deep: true }
);

// Computed to format the display value in the text field
const displayDate = computed(() => {
    if (date.value && time.value) {
        const selectedDate = new Date(date.value);
        const [hours, minutes] = time.value.split(":").map(Number);
        selectedDate.setHours(hours, minutes);
        // Format manually to avoid timezone conversion issues
        return `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1).toString().padStart(2, "0")}-${selectedDate.getDate().toString().padStart(2, "0")} ${selectedDate.getHours().toString().padStart(2, "0")}:${selectedDate.getMinutes().toString().padStart(2, "0")}`;
    }
    return "";
});
const displayTime = computed(() => time.value);

function toggleDatePicker() {
    menuVisible.value = !menuVisible.value;
}
</script>
