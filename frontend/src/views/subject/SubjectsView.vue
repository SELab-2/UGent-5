<template>
    <div v-if="isError" class="v-container">
        <p>Error: {{ error }}</p>
    </div>
    <v-row v-else>
        <v-col cols="10">
            <BackgroundContainer>
                <v-row>
                    <v-col>
                        <SubjectsHeaderContainer
                            :academic-years="academicYears"
                            :is-loading="isLoading"
                            @academic-year-changed="onAcademicYearChanged"
                        ></SubjectsHeaderContainer>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col v-for="(subject, index) in subjectsByAcademicYear" :key="index" cols="6">
                        <SubjectCard
                            :subject="subject"
                            :is-loading="isLoading"
                            class="subject-card"
                        >
                        </SubjectCard>
                    </v-col>
                </v-row>
            </BackgroundContainer>
        </v-col>
        <v-col cols="2">
            <div class="action-btn-container">
                <router-link to="">
                    <v-btn prepend-icon="mdi-plus-circle">
                        Create subject
                    </v-btn>
                </router-link>
            </div>
        </v-col>
    </v-row>

</template>

<script setup lang="ts">
import {useSubjectsQuery} from "@/queries/Subject";
import BackgroundContainer from "@/components/BackgroundContainer.vue";
import SubjectsHeaderContainer from "@/components/subjects/SubjectsHeaderContainer.vue";
import SubjectCard from "@/components/subjects/SubjectCard.vue";
import {computed, ref} from "vue";
import getCurrentAcademicYear from "@/composables/useAcademicYear";

const {data: subjects, error, isLoading, isError} = useSubjectsQuery();

const academicYears = computed(() => {
    return Array.from(
        new Set([...(subjects.value || [])].map(subject => subject.academic_year))
    ).sort((a, b) => b - a);
});


const selectedAcademicYear = ref<number>(getCurrentAcademicYear());

const subjectsByAcademicYear = computed(() => {
    return [...(subjects.value || [])].filter(subject => subject.academic_year === selectedAcademicYear.value);
});


const onAcademicYearChanged = (academicYear: number) => {
    selectedAcademicYear.value = academicYear;
}

</script>


<style scoped>

.subject-card {
    margin-top: 10px; /* Adjust as needed */
}

.action-btn-container {
    margin-top: 30px;
}

</style>
