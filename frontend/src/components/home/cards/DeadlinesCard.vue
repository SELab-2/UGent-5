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
import { ref } from "vue";
const deadlines = ref<Deadline[]>([
    {
        project: {
            id: 1,
            name: "project A",
            subject_id: 1,
            deadline: new Date(2024, 4, 28, 23, 59),
            description: "a description",
        },
        status: "none",
    },
    {
        project: {
            id: 2,
            name: "project B",
            subject_id: 2,
            deadline: new Date(2024, 6, 2, 17, 0),
            description: "another description",
        },
        status: "accepted",
    },
    {
        project: {
            id: 3,
            name: "project C",
            subject_id: 3,
            deadline: new Date(2024, 5, 5, 22, 0),
            description: "last description",
        },
        status: "rejected",
    },
]);
</script>
