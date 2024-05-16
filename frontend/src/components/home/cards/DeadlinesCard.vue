<template>
    <HomeScreenCard :title="'homescreen.deadlines'">
        <DeadlineItem v-for="project in filteredProjects" :project="project" :key="project.id" />
    </HomeScreenCard>
</template>

<script setup lang="ts">
import HomeScreenCard from "@/components/home/cards/HomeScreenCard.vue";
import DeadlineItem from "@/components/home/listcontent/DeadlineItem.vue";
import { useProjectsQuery } from "@/queries/Project";
import { computed } from "vue";

const { data: projects } = useProjectsQuery();

const filteredProjects = computed(() => {
    if (!projects.value) return [];
    return [...projects.value.as_student, ...projects.value.as_instructor]
        .filter((project) => project.deadline > new Date())
        .sort((a, b) => a.deadline.getTime() - b.deadline.getTime())
        .slice(0, 5);
});
</script>
