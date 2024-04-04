<template>
    <v-menu
        v-model="menuVisible"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        full-width
    >
        <template v-slot:activator="{ on, attrs }">
            <v-text-field
                :value="displayDate"
                label="Deadline"
                readonly
                v-bind="attrs"
                @click="toggleDatePicker"
                v-on="on"
            ></v-text-field>
        </template>
        <v-date-picker
            v-model="date"
            no-title
            @update:modelValue="updateDate"
        ></v-date-picker>
    </v-menu>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useVModel } from '@vueuse/core';

const props = defineProps({
    modelValue: String
});

const emit = defineEmits(['update:modelValue']);

const menuVisible = ref(false);
const date = useVModel(props, 'modelValue', emit);

const displayDate = computed(() => {
    if (date.value) {
        const selectedDate = new Date(date.value);
        selectedDate.setMinutes(selectedDate.getMinutes() - selectedDate.getTimezoneOffset());
        return selectedDate.toISOString().substr(0, 10);
    }
    return '';
});

function toggleDatePicker() {
    menuVisible.value = !menuVisible.value;
}

function updateDate(newValue) {
    console.log("hey");
    date.value = newValue;
    menuVisible.value = false;
}
</script>






<!--<style scoped>-->
<!--.date-picker-container {-->
<!--    position: relative;-->
<!--}-->

<!--.date-input {-->
<!--    padding: 8px;-->
<!--    border: 1px solid var(&#45;&#45;v-border-color, #ccc);-->
<!--    border-radius: 4px;-->
<!--    cursor: pointer;-->
<!--    background-color: var(&#45;&#45;v-background-color, #fff);-->
<!--}-->

<!--/* Update hover and selected styles to use Vuetify's color system */-->
<!--.date-picker-day:hover, .date-picker-day.selected {-->
<!--    background-color: var(&#45;&#45;v-primary-base, #408000);-->
<!--}-->

<!--/* Ensure responsiveness and alignment with Vuetify's grid system */-->
<!--.date-picker-grid {-->
<!--    display: grid;-->
<!--    grid-template-columns: repeat(7, 1fr);-->
<!--    gap: var(&#45;&#45;v-grid-gutter, 5px);-->
<!--}-->
<!--</style>-->

