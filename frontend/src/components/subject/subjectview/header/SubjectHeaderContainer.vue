<template>
    <v-row>
        <v-col cols="4">
            <SubjectHeaderImage
                :imagePath="imagePath"
                :role="isInstructor ? SubjectRole.Instructor : isStudent ? SubjectRole.Student : SubjectRole.Admin"
            ></SubjectHeaderImage>
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

defineProps<{
    title: string;
    academicYear: number;
    instructors: User[];
    imagePath: string;
    isInstructor: boolean;
    isStudent: boolean;
}>();
</script>

<style scoped></style>
