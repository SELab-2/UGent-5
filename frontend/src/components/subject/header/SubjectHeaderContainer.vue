<template>
    <v-row>
        <v-col cols="4">
            <SubjectHeaderImage :imagePath="imagePath" :is-loading="isLoading">
            </SubjectHeaderImage>
        </v-col>
        <v-col cols="8">
            <SubjectHeaderCard
                :title="title"
                :academic-year="academicYear"
                :instructors="instructors"
                :is-loading="isLoading"
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
    academicYear: string;
    instructors: User[];
    isLoading: boolean;
    imagePath: string;
}>();
</script>

<style scoped></style>
