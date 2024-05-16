<template>
    <HomeScreenCard :title="'homescreen.deadlines'">
        <DeadlineItem
            v-for="deadline in deadlines"
            :deadline="deadline"
            :key="deadline.project.id"
        />
    </HomeScreenCard>
</template>

<script setup lang="ts">
import HomeScreenCard from "@/components/home/cards/HomeScreenCard.vue";
import DeadlineItem from "@/components/home/listcontent/DeadlineItem.vue";
import { type Deadline } from "@/models/Project";
import { useProjectsQuery } from "@/queries/Project";
import { computed } from "vue";

const { data: projects } = useProjectsQuery();
const deadlines = computed<Deadline[]>(
    () =>
        projects.value
            ?.filter((project) => project.deadline > new Date())
            .sort((a, b) => a.deadline.getTime() - b.deadline.getTime())
            .slice(0,5)
            .map((project) => ({
                project,
                status: "none",
            })) || []
);
</script>
