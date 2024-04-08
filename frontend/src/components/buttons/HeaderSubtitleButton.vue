<template>
    <v-btn
        variant="outlined"
        rounded="xl"
        :class="[!clickable ? 'not-clickable' : '', 'header-button']"
        color="#9FB6FF"
    >
        <span class="button-text">{{ title }}</span>
    </v-btn>
</template>

<script setup lang="ts">
import {defineProps} from 'vue';

const props = defineProps<{
    title: string,
    clickable: boolean,
}>();
</script>

<style scoped>
.not-clickable {
    cursor: default;
    pointer-events: none;
}

.button-text {
    color: #003EFF;
    font-weight: 1000;
    text-transform: uppercase;
    font-family: 'Poppins', sans-serif;
    font-size: 10px;
    line-height: 16px;
    letter-spacing: -0.5px;
}

.header-button {
    margin-bottom: -10px;
}
</style>
