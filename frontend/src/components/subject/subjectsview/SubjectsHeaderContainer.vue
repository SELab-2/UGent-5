<template>
    <v-row>
        <v-col cols="6">
            <SubjectsHeaderCard
                :academic-years="academicYears"
                @academic-year-changed="onAcademicYearChanged"
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
