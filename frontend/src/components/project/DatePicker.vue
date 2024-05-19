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

const menuVisible = ref(false);
const date = ref(new Date(props.modelValue || Date.now()));
const time = ref(formatTime(props.modelValue || new Date()));
watch(
    () => props.modelValue,
    (newValue) => {
        if (newValue) {
            if (new Date(newValue).getTime() !== date.value.getTime()) {
                date.value = new Date(newValue);
            }
        }
    },
    { immediate: true }
);
function formatTime(date: Date): string {
    const formattedTime = `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
    return formattedTime;
}

watch(
    [date, time],
    () => {
        const [hours, minutes] = time.value.split(":").map(Number);
        const updatedDate = new Date(date.value);
        updatedDate.setHours(hours, minutes, 0, 0);
        if (hours === 0 && minutes === 0) {
            emit("update:modelValue", new Date(updatedDate));
        } else {
            emit("update:modelValue", new Date(updatedDate));
        }
    },
    { deep: true }
);

const displayDate = computed(() => {
    if (date.value && time.value) {
        const selectedDate = new Date(date.value);
        const [hours, minutes] = time.value.split(":").map(Number);
        selectedDate.setHours(hours, minutes);
        return `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1).toString().padStart(2, "0")}-${selectedDate.getDate().toString().padStart(2, "0")} ${selectedDate.getHours().toString().padStart(2, "0")}:${selectedDate.getMinutes().toString().padStart(2, "0")}`;
    }
    return "";
});

function toggleDatePicker() {
    menuVisible.value = !menuVisible.value;
}
</script>
