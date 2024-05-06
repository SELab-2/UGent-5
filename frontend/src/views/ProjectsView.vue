<template>
    <div>
        <v-container>
            <h1 v-if="isLoading" class="welcome">{{ $t("default.loading.loading_page") }}</h1>
            <h1 v-else-if="isError || noProjectsFound" class="welcome">
                {{ $t("project.not_found") }}
            </h1>
            <div v-else class="projectInfo">
                <v-row class="rowheader">
                    <h1>{{ $t("project.myProject") }}</h1>
                    <v-btn-toggle v-model="activeButton">
                        <v-btn value="notFinished" class="leftbuttonspace">{{
                            $t("project.not_finished")
                        }}</v-btn>
                        <v-btn value="archived" class="leftbuttonspace">{{
                            $t("project.archived")
                        }}</v-btn>
                    </v-btn-toggle>
                </v-row>
                <ProjectMiniCard
                    v-for="project in filteredProjects"
                    :key="project.id"
                    :project="project"
                    class="project-card"
                />
            </div>
        </v-container>
    </div>
</template>

<script setup lang="ts">
import { useProjectsQuery } from "@/queries/Project";
import ProjectMiniCard from "@/components/project/ProjectMiniCard.vue";
import { computed, ref } from "vue";
import type Project from "@/models/Project";

const { data: projects, isLoading, isError } = useProjectsQuery();
const noProjectsFound = computed(() => projects.value?.length === 0);

const activeButton = ref("");

const filteredProjects = computed(() => {
    if (!projects.value) return [];

    const now = new Date();
    const sortedProjects = projects.value
        .slice()
        .sort(
            (a: Project, b: Project) =>
                new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
        );

    switch (activeButton.value) {
        case "archived":
            return sortedProjects.filter((project: Project) => new Date(project.deadline) < now);
        case "notFinished":
            return sortedProjects.filter((project: Project) => new Date(project.deadline) > now);
        default:
            return sortedProjects;
    }
});
</script>

<style scoped>
.project-card {
    margin-top: 10px;
}

.projectInfo {
    padding: 10px;
}

.rowheader {
    padding: 10px;
}

.leftbuttonspace {
    margin-left: 10px;
}
</style>
