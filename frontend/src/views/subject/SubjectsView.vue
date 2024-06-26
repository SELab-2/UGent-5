<template>
    <div v-if="isError" class="v-container">
        <p>Error: {{ error }}</p>
    </div>
    <v-skeleton-loader v-else type="card" :loading="isLoading">
        <v-row class="subjectsview">
            <v-col class="col-sm-12 col-md-6">
                <v-card variant="flat">
                    <v-row>
                        <v-col>
                            <SubjectsHeaderContainer
                                :academic-years="academicYears"
                                :subjects="subjectsByAcademicYear"
                                @academic-year-changed="onAcademicYearChanged"
                                @subjects-filter-changed="onSubjectsFilterChanged"
                                class="headercontainer"
                            ></SubjectsHeaderContainer>
                        </v-col>
                    </v-row>
                    <v-row>
                        <div v-if="filteredSubjectsByAcademicYear.length === 0" class="no-results">
                            <h1>{{ $t("subjects.no_subjects") }}</h1>
                        </div>
                        <v-col
                            v-else
                            v-for="(subject, index) in filteredSubjectsByAcademicYear"
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
                </v-card>
            </v-col>
            <v-col v-if="isAdmin || isTeacher" cols="2" class="action-btn-container">
                <router-link :to="{ name: 'create-subject' }">
                    <v-btn prepend-icon="mdi-plus-circle" class="button">
                        {{ $t("subjects.create_subject") }}
                    </v-btn>
                </router-link>
            </v-col>
        </v-row>
    </v-skeleton-loader>
</template>

<script setup lang="ts">
import { useSubjectsQuery } from "@/queries/Subject";
import SubjectsHeaderContainer from "@/components/subject/subjects/header/SubjectsHeaderContainer.vue";
import SubjectCard from "@/components/subject/subjects/body/SubjectCard.vue";
import { computed, ref } from "vue";
import useAcademicYear from "@/composables/useAcademicYear";
import useIsTeacher from "@/composables/useIsTeacher";
import useIsAdmin from "@/composables/useIsAdmin";
import { type SubjectFilter, SubjectRole } from "@/models/Subject";

const { data: subjects, error, isLoading, isError } = useSubjectsQuery();
const subjectsList = computed(() => {
    const instructorSubjects = subjects.value!.as_instructor.map((subject) => ({
        subjectData: subject,
        role: SubjectRole.Instructor,
    }));
    const studentSubjects = subjects.value!.as_student.map((subject) => ({
        subjectData: subject,
        role: SubjectRole.Student,
    }));

    return [...instructorSubjects, ...studentSubjects];
});
const activeAcademicYear = ref<number>(useAcademicYear());
const activeSubjectsFilter = ref<SubjectFilter>({
    showInstructorSubjects: true,
    showStudentSubjects: true,
});
const { isTeacher } = useIsTeacher();
const { isAdmin } = useIsAdmin();

const academicYears = computed(() => {
    return Array.from(
        new Set([...(subjectsList.value || [])].map((subject) => subject.subjectData.academic_year))
    ).sort((a, b) => b - a);
});

const subjectsByAcademicYear = computed(() => {
    return [...(subjectsList.value || [])].filter(
        (subject) => subject.subjectData.academic_year === activeAcademicYear.value
    );
});

const filteredSubjectsByAcademicYear = computed(() => {
    const subjects = [...(subjectsByAcademicYear.value || [])];
    return subjects.filter((subject) => {
        if (
            activeSubjectsFilter.value.showInstructorSubjects &&
            subject.role === SubjectRole.Instructor
        ) {
            return true;
        }
        if (
            activeSubjectsFilter.value.showStudentSubjects &&
            subject.role === SubjectRole.Student
        ) {
            return true;
        }
        return false;
    });
});

const onSubjectsFilterChanged = (filter: SubjectFilter) => {
    activeSubjectsFilter.value = filter;
};

const onAcademicYearChanged = (academicYear: number) => {
    activeAcademicYear.value = academicYear;
    activeSubjectsFilter.value = {
        showInstructorSubjects: true,
        showStudentSubjects: true,
    };
};
</script>

<style scoped>
.action-btn-container {
    margin-top: 30px;
    min-width: 200px;
}

.no-results {
    text-align: center;
    margin: 50px;
}

.subjectsview {
    margin-left: 40px;
    margin-top: 30px;
    margin-right: 40px;
    background-color: rgb(var(--v-theme-background));
}

.headercontainer {
    border-color: rgb(var(--v-theme-text));
    background-color: rgb(var(--v-theme-primary));
    border-radius: 3px;
}

.button {
    background-color: rgb(var(--v-theme-primary));
    color: white;
    width: 200px;
}
</style>
