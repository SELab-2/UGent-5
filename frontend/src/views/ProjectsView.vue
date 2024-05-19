<template>
    <div class="projects">
        <h1 v-if="isLoading">{{ $t("default.loading.loading_page") }}</h1>
        <h1 v-else-if="isError || noProjectsFound" class="welcome">
            {{ $t("project.not_found") }}
        </h1>
        <div v-else class="projectInfo">
            <v-card class="title-card" variant="flat" color="primary">
                <v-card-title class="title">{{ $t("project.myProject") }}</v-card-title>
                <v-btn-toggle v-model="activeButton" class="button">
                    <v-btn value="finished">{{ $t("project.finished") }}</v-btn>
                </v-btn-toggle>
            </v-card>
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

.title-card{
    padding: 30px;
    color: white;
}
.title-card:after {
    content:'';
    background: url('@/assets/ugent_background.png') no-repeat center center;
    position: absolute;
    top:0;
    left: 0;
    width:100%;
    height:100%;
    z-index:-1;
    opacity: 0.4;
}

.title {
    font-size: 32px;
    margin-bottom: 12px;
}

.button {
    height: 30px;
    margin-top: 10px;
    margin-left: 30px;
}

.projects {
    margin: 40px;
}

.divider {
    margin-bottom: 30px;
}
</style>
