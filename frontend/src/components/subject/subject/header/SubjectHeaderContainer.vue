<template>
    <SubjectHeaderCard
        :title="title"
        :subject-id="subjectId"
        :academic-year="academicYear"
        :instructors="instructors"
        :isInstructor="isInstructor"
        :role="userRole"
    >
    </SubjectHeaderCard>
</template>

<script setup lang="ts">
import SubjectHeaderCard from "@/components/subject/subject/header/SubjectHeaderCard.vue";
import type User from "@/models/User";
import { SubjectRole } from "@/models/Subject";
import { computed, toRefs } from "vue";

const props = defineProps<{
    title: string;
    subjectId: number;
    academicYear: number;
    instructors: User[];
    imagePath: string;
    isInstructor: boolean;
    isStudent: boolean;
    isAdmin: boolean;
}>();

const { isInstructor, isStudent, isAdmin } = toRefs(props);

const userRole = computed(() => {
    if (isInstructor.value) return SubjectRole.Instructor;
    if (isStudent.value) return SubjectRole.Student;
    if (isAdmin.value) return SubjectRole.Admin;
    return SubjectRole.None;
});
</script>

<style scoped></style>
