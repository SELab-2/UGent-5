<template>
    <HomeScreenSkeletonCard v-if="isSubjectsLoading" />
    <h1 v-else-if="isSubjectsError">{{ $t("subject.error") }}</h1>
    <HomeScreenCard v-else :title="'homescreen.subjects'">
        <SubjectItem v-for="subject in filteredSubjects" :subject="subject" :key="subject.id" />
    </HomeScreenCard>
</template>

<script setup lang="ts">
import HomeScreenCard from "@/components/home/cards/HomeScreenCard.vue";
import HomeScreenSkeletonCard from "@/components/home/cards/HomeScreenSkeletonCard.vue";
import SubjectItem from "@/components/home/listcontent/SubjectItem.vue";
import useAcademicYear from "@/composables/useAcademicYear";
import { useSubjectsQuery } from "@/queries/Subject";
import { computed } from "vue";
const {
    data: subjects,
    isLoading: isSubjectsLoading,
    isError: isSubjectsError,
} = useSubjectsQuery();

const academicYear = useAcademicYear();

const filteredSubjects = computed(() => {
    if (!subjects.value) return [];
    return [...subjects.value!.as_student, ...subjects.value!.as_instructor].filter(
        (subject) => subject.academic_year === academicYear
    );
});
</script>
