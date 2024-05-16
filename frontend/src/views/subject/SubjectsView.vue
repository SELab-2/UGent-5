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
                            <SubjectCard
                                :subject="subject.subjectData"
                                :role="subject.role"
                                class="subject-card"
                            ></SubjectCard>
                        </v-col>
                    </v-row>
                </BackgroundContainer>
            </v-col>
            <v-col v-if="isTeacher" cols="2">
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
import {SubjectRole} from "@/models/Subject";

const { data: subjects, error, isLoading, isError } = useSubjectsQuery();
const subjectsList = computed(() => {
    const studentSubjects = subjects.value!.as_student.map(subject => ({subjectData: subject, role: SubjectRole.Student}));
    const instructorSubjects = subjects.value!.as_instructor.map(subject => ({subjectData: subject, role: SubjectRole.Instructor}));
    return [...studentSubjects, ...instructorSubjects];
});
const selectedAcademicYear = ref<number>(useAcademicYear());
const { isTeacher } = useIsTeacher();

const academicYears = computed(() => {
    return Array.from(
        new Set([...(subjectsList.value || [])].map((subject) => subject.subjectData.academic_year))
    ).sort((a, b) => b - a);
});

const subjectsByAcademicYear = computed(() => {
    return [...(subjectsList.value || [])].filter(
        (subject) => subject.subjectData.academic_year === selectedAcademicYear.value
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
