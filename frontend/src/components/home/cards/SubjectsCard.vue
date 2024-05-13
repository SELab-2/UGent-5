<template>
    <HomeScreenSkeletonCard v-if="isSubjectsLoading" />
    <!-- TODO: Add error handling -->
    <h1 v-else-if="isSubjectsError">Error loading subjects</h1>
    <HomeScreenCard v-else :title="'homescreen.subjects'">
        <SubjectItem v-for="subject in [...subjects!.as_student, ...subjects!.as_instructor]" :subject="subject" :key="subject.id" />
    </HomeScreenCard>
</template>

<script setup lang="ts">
import HomeScreenCard from "@/components/home/cards/HomeScreenCard.vue";
import HomeScreenSkeletonCard from "@/components/home/cards/HomeScreenSkeletonCard.vue";
import SubjectItem from "@/components/home/listcontent/SubjectItem.vue";
import { useSubjectsQuery } from "@/queries/Subject";
const {
    data: subjects,
    isLoading: isSubjectsLoading,
    isError: isSubjectsError,
} = useSubjectsQuery();
</script>
