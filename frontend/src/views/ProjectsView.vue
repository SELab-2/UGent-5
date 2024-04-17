<template>
    <h1 v-if="isLoading" class="welcome">{{ $t("default.loading.loading_page") }}</h1>
    <h1 v-else-if="isError" class="welcome">No projects found!</h1>
    <div v-else class="projectInfo">
        <h1>My Projects</h1>
        <ProjectMiniCard v-for="project in projects" :key="project.id" :projectId="project.id" />
    </div>
</template>

<script setup lang="ts">
import { useProjectsQuery } from "@/queries/Project";
import ProjectMiniCard from "@/components/project/ProjectMiniCard.vue";

const { data: projects, isLoading, isError } = useProjectsQuery();

</script>

<style scoped></style>
