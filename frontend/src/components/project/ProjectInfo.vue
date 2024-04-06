<template>
    <div>
        <h1>{{ project.name }}</h1>
    </div>
</template>

<script setup lang="ts">
import type Project from "@/models/Project";
const props = defineProps<{
    project: Project;
}>();

</script>

<style scoped></style>
