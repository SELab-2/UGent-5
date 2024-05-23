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
    </v-menu>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const date = defineModel<Date>({});

defineProps<{
    label: string;
}>();

const menuVisible = ref(false);

// Computed to format the date as ISO string (just the date part)
const displayDate = computed(() => {
    if (date.value) {
        const selectedDate = new Date(date.value.getTime());
        selectedDate.setMinutes(selectedDate.getMinutes() - selectedDate.getTimezoneOffset());
        return selectedDate.toISOString().substring(0, 10);
    }
    return "";
});

function toggleDatePicker() {
    menuVisible.value = !menuVisible.value;
}
</script>
