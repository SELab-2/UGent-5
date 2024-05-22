<template>
    <div class="projects">
        <h1 v-if="isLoading">{{ $t("default.loading.loading_page") }}</h1>
        <h1 v-else-if="isError || noProjectsFound" class="welcome">
            {{ $t("project.not_found") }}
        </h1>
        <div v-else class="projectInfo">
            <TitleContainer :title="$t('project.myProject')">
                <v-btn-toggle v-model="activeButton" class="button">
                    <v-btn value="finished">{{ $t("project.finished") }}</v-btn>
                </v-btn-toggle>
            </TitleContainer>
            <v-divider class="divider" />
            <ProjectMiniCard
                v-for="project in filteredProjects"
                :key="project.id"
                :project="project"
                class="project-card"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useProjectsQuery } from "@/queries/Project";
import ProjectMiniCard from "@/components/project/ProjectMiniCard.vue";
import TitleContainer from "@/components/TitleContainer.vue";
import { computed, ref } from "vue";
import type Project from "@/models/Project";
const { data: projects, isLoading, isError } = useProjectsQuery();
const allProjects = computed(() =>
    isLoading.value ? [] : [...projects.value!.as_student, ...projects.value!.as_instructor]
);
const noProjectsFound = computed(() => allProjects.value.length === 0);

const activeButton = ref("notFinished");

const filteredProjects = computed(() => {
    const now = new Date();
    const sortedProjects = allProjects.value
        .slice()
        .sort(
            (a: Project, b: Project) =>
                new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
        );

    switch (activeButton.value) {
        case "finished":
            return sortedProjects.filter((project: Project) => new Date(project.deadline) < now);
        default:
            return sortedProjects.filter((project: Project) => new Date(project.deadline) > now);
    }
});
</script>

<style scoped>
.project-card {
    margin-top: 10px;
}

.projectInfo {
    padding: 15px;
    margin: 25px;
}

.button {
    height: 30px;
    margin-top: 10px;
    margin-left: 30px;
}

.projects {
    margin: 15px;
}

.divider {
    margin-bottom: 30px;
}
</style>
