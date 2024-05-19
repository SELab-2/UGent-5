<template>
    <v-row>
        <v-col cols="4">
            <SubjectHeaderImage :imagePath="imagePath" :role="userRole"></SubjectHeaderImage>
        </v-col>
        <v-col cols="8">
            <SubjectHeaderCard
                :title="title"
                :academic-year="academicYear"
                :instructors="instructors"
                :isInstructor="isInstructor"
            >
            </SubjectHeaderCard>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import SubjectHeaderCard from "@/components/subject/subjectview/header/SubjectHeaderCard.vue";
import type User from "@/models/User";
import SubjectHeaderImage from "@/components/subject/subjectview/header/SubjectHeaderImage.vue";
import { SubjectRole } from "@/models/Subject";
import { computed, toRefs } from "vue";

const props = defineProps<{
    title: string;
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
