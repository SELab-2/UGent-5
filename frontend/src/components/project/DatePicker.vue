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
        <v-time-picker v-model="time"></v-time-picker>
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
const time = ref("12:00"); // default to noon, or could be null if you prefer

// Whenever the date or time changes, emit the new combined value
watch(
    () => props.modelValue,
    (newVal) => {
        if (newVal) {
            date.value = new Date(newVal);
            time.value = `${newVal.getHours()}:${newVal.getMinutes()}`;
        }
    },
    { immediate: true }
);

// Computed to format the display value in the text field
const displayDate = computed(() => {
    if (date.value && time.value) {
        const selectedDate = new Date(date.value);
        const [hours, minutes] = time.value.split(":").map(Number);
        selectedDate.setHours(hours, minutes);
        return selectedDate.toISOString().substring(0, 16).replace("T", " ");
    }
    return "";
});
const displayTime = computed(() => time.value);

function toggleDatePicker() {
    menuVisible.value = !menuVisible.value;
}
</script>
