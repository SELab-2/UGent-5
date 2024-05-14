<template>
    <v-row>
        <v-col cols="4">
            <SubjectHeaderImage :imagePath="imagePath"> </SubjectHeaderImage>
        </v-col>
        <v-col cols="8">
            <SubjectHeaderCard
                :title="title"
                :academic-year="academicYear"
                :instructors="instructors"
                :is-instructor="isInstructor"
            >
            </SubjectHeaderCard>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import SubjectHeaderCard from "@/components/subject/header/SubjectHeaderCard.vue";
import type User from "@/models/User";
import SubjectHeaderImage from "@/components/subject/header/SubjectHeaderImage.vue";

defineProps<{
    title: string;
    academicYear: number;
    instructors: User[];
    imagePath: string;
    isInstructor: boolean;
}>();
</script>

<style scoped></style>
