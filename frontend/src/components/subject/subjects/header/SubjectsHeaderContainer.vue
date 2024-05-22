<template>
    <SubjectsHeaderCard
        :academic-years="academicYears"
        :subjects="subjects"
        @academic-year-changed="$emit('academic-year-changed', $event)"
        @subjects-filter-changed="$emit('subjects-filter-changed', $event)"
    ></SubjectsHeaderCard>
</template>

<script setup lang="ts">
import SubjectsHeaderCard from "@/components/subject/subjectsview/header/SubjectsHeaderCard.vue";
import type { SubjectDetails, SubjectFilter } from "@/models/Subject";

defineProps<{
    academicYears: number[];
    subjects: SubjectDetails[];
}>();

defineEmits<{
    (e: "academic-year-changed", academicYear: number): void;
    (e: "subjects-filter-changed", filter: SubjectFilter): void;
}>();
</script>

<style scoped></style>
