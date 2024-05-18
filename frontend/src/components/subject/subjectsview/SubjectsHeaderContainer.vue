<template>
    <v-row>
        <v-col cols="7">
            <SubjectsHeaderCard
                :academic-years="academicYears"
                :subjects="subjects"
                @academic-year-changed="$emit('academic-year-changed', $event)"
                @subjects-filter-changed="$emit('subjects-filter-changed', $event)"
            ></SubjectsHeaderCard>
        </v-col>
        <v-col>
            <SubjectsHeaderImage
                image-path="https://www.ugent.be/img/dcom/faciliteiten/ufo-logo.png"
            ></SubjectsHeaderImage>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import SubjectsHeaderCard from "@/components/subject/subjectsview/SubjectsHeaderCard.vue";
import SubjectsHeaderImage from "@/components/subject/extra/SubjectsHeaderImage.vue";
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
