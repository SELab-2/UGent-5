<template>
    <h1>{{ selectedTab }}</h1>
    <h2>{{project?.name}}</h2>
</template>

<script setup lang="ts">
import type Project from "@/models/Project";

defineProps<{
    selectedTab: number;
    project: Project | undefined;
}>();
</script>

<style scoped>

</style>
