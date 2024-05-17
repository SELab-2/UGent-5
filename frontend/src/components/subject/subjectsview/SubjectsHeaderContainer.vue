<template>
    <v-row>
        <v-col cols="7">
            <SubjectsHeaderCard
                :academic-years="academicYears"
                :is-instructor="isInstructor"
                @academic-year-changed="onAcademicYearChanged"
                @subjects-filter-changed="onSubjectsFilterChanged"
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
import SubjectsHeaderImage from "@/components/subject/subjectsview/SubjectsHeaderImage.vue";
import type {SubjectFilter} from "@/models/Subject";

defineProps<{
    academicYears: number[];
    isInstructor: boolean;
}>();

const emit = defineEmits<{
    (e: "academic-year-changed", academicYear: number): void;
    (e: "subjects-filter-changed", filter: SubjectFilter): void;
}>();

const onAcademicYearChanged = (academicYear: number) => {
    emit("academic-year-changed", academicYear);
};

const onSubjectsFilterChanged = (filter: SubjectFilter) => {
    emit("subjects-filter-changed", filter);
};
</script>

<style scoped></style>
