<template>
    <v-btn
        size="small"
        variant="outlined"
        rounded="xl"
        :class="[
            !clickable ? 'not-clickable' : '',
            'subtitle-button',
            active ? 'subtitle-button-active' : '',
        ]"
        color="#9FB6FF"
    >
        <span class="button-text">{{ title }}</span>
    </v-btn>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

defineProps<{
    title: string;
    clickable: boolean;
    active: boolean;
}>();
</script>

<style scoped>
.subtitle-button {
    margin-right: 10px;
}

.button-text {
    color: #003eff;
    font-weight: 1000;
    text-transform: uppercase;
    font-family: "Poppins", sans-serif;
    font-size: 10px;
    line-height: 16px;
    letter-spacing: -0.5px;
}
</style>
