<template>
    <div v-if="isError" class="v-container">
        <p>Error: {{ error }}</p>
    </div>

    <v-skeleton-loader v-else type="card" :loading="isLoading">
        <v-row>
            <v-col :cols="isTeacher ? 10 : 12">
                <BackgroundContainer>
                    <v-row>
                        <v-col>
                            <SubjectsHeaderContainer
                                :academic-years="academicYears"
                                @academic-year-changed="onAcademicYearChanged"
                            ></SubjectsHeaderContainer>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col
                            v-for="(subject, index) in subjectsByAcademicYear"
                            :key="index"
                            cols="6"
                        >
                            <SubjectCard :subject="subject" class="subject-card"> </SubjectCard>
                        </v-col>
                    </v-row>
                </BackgroundContainer>
            </v-col>
            <v-col v-if="isTeacher || isAdmin" cols="2">
                <div class="action-btn-container">
                    <router-link to="">
                        <v-btn prepend-icon="mdi-plus-circle">
                            {{ $t("subjects.create_subject") }}
                        </v-btn>
                    </router-link>
                </div>
            </v-col>
        </v-row>
    </v-skeleton-loader>
</template>

<script setup lang="ts">
import { useSubjectsQuery } from "@/queries/Subject";
import BackgroundContainer from "@/components/BackgroundContainer.vue";
import SubjectsHeaderContainer from "@/components/subject/subjectsview/SubjectsHeaderContainer.vue";
import SubjectCard from "@/components/subject/subjectsview/SubjectCard.vue";
import { computed, ref } from "vue";
import useAcademicYear from "@/composables/useAcademicYear";
import useIsTeacher from "@/composables/useIsTeacher";
import useIsAdmin from "@/composables/useIsAdmin";

const { data: subjects, error, isLoading, isError } = useSubjectsQuery();
const subjectsList = computed(() => {
    return [...subjects.value!.as_student, ...subjects.value!.as_instructor] || [];
});
const selectedAcademicYear = ref<number>(useAcademicYear());
const { isTeacher } = useIsTeacher();
const { isAdmin } = useIsAdmin();

const academicYears = computed(() => {
    return Array.from(
        new Set([...(subjectsList.value || [])].map((subject) => subject.academic_year))
    ).sort((a, b) => b - a);
});

const subjectsByAcademicYear = computed(() => {
    return [...(subjectsList.value || [])].filter(
        (subject) => subject.academic_year === selectedAcademicYear.value
    );
});

/* will be necessary to show checkboxes in header when queries refactoring returns instructor and student subjects
const isInstructor = computed(() => {
    return isTeacher;
});
 */

const onAcademicYearChanged = (academicYear: number) => {
    selectedAcademicYear.value = academicYear;
};
</script>

<style scoped>
.subject-card {
    margin-top: 10px;
}

.action-btn-container {
    margin-top: 30px;
}
</style>
