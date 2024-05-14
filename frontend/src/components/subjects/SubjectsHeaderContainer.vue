<template>
    <v-row>
        <v-col cols="6">
            <SubjectsHeaderCard
                :academic-years="academicYears"
                @academic-year-changed="onAcademicYearChanged"
            ></SubjectsHeaderCard>
        </v-col>
        <v-col>
            <SubjectHeaderImage
                image-path="https://www.ugent.be/img/dcom/faciliteiten/ufo-logo.png"
            ></SubjectHeaderImage>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import SubjectsHeaderCard from "@/components/subjects/SubjectsHeaderCard.vue";
import SubjectHeaderImage from "@/components/subject/header/SubjectHeaderImage.vue";

defineProps<{
    academicYears: number[];
}>();

const emit = defineEmits<{
    (e: "academic-year-changed", academicYear: number): void;
}>();

const onAcademicYearChanged = (academicYear: number) => {
    emit("academic-year-changed", academicYear);
};
</script>

<style scoped></style>
