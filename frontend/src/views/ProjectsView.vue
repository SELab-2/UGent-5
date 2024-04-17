<template>
    <h1 v-if="isLoading" class="welcome">{{ $t("default.loading.loading_page") }}</h1>
    <h1 v-else-if="isError" class="welcome">No projects found!</h1>
    <div v-else class="projectInfo">
        <h1>My Projects:</h1>
        <div v-for="project in projects.projects" :key="project.id">
            <ProjectMiniCard :projectId="project.id" />
        </div>
    </div>
</template>

<script setup lang="ts">


import {useProjectsQuery} from "@/queries/Project";
import ProjectMiniCard from "@/components/project/ProjectMiniCard.vue";
import {computed} from "vue";


const { data: projects, isLoading, isError} = useProjectsQuery();



</script>

<style scoped></style>
