<template>
    <v-card variant="text" class="projects-card">
        <v-card-title>
            <span class="title">{{$t('subject.projects')}}</span>
        </v-card-title>
        <v-card-subtitle>
            <div class="d-flex justify-start">
                <HeaderSubtitleButton :title="$t('subject.projectsPage.all')" clickable></HeaderSubtitleButton>
                <HeaderSubtitleButton :title="$t('subject.projectsPage.active')" clickable></HeaderSubtitleButton>
                <HeaderSubtitleButton :title="$t('subject.projectsPage.completed')" clickable></HeaderSubtitleButton>
            </div>
        </v-card-subtitle>
        <v-card-item>
            <ProjectCard :project="projects[0]"></ProjectCard>
            <!--v-virtual-scroll :items="projects">
                <template v-slot="{ item }">
                    <ProjectCard :project="item"></ProjectCard>
                </template>
            </v-virtual-scroll-->
        </v-card-item>
    </v-card>

</template>

<script setup lang="ts">

import HeaderSubtitleButton from "@/components/buttons/HeaderSubtitleButton.vue";
import type Project from "@/models/Project";
import ProjectCard from "@/components/subject/body/projects/ProjectCard.vue";
defineProps<{
    projects: Project[] | undefined;
}>();
</script>

<style scoped>

.projects-card {
    background-color: white;
    padding: 20px;
    border-radius: 20px;
}

.title {
    font-size: 32px;
    letter-spacing: -0.5px;
    font-weight: bold;
    margin-bottom: 20px;
    font-family: 'Poppins', sans-serif;
}

</style>
