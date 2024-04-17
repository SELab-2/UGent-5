<template>
    <v-icon left>mdi-calendar-clock</v-icon>
    <span class="project-name">{{ projectName }}</span>
</template>

<script setup lang="ts">
defineProps<{
    projectName: string;
}>();
</script>

<style scoped>
.project-name {
    margin-left: 10px; /* Add spacing between icon and project name */
}
</style>
