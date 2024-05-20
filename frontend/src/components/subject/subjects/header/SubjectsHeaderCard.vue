<template>
    <v-card variant="text" class="title-card" width="100%">
        <v-row>
            <v-col>
                <v-card-title class="title">
                    {{ $t("subjects.title") }}
                </v-card-title>

                <v-card-text>
                    <div class="chip-container">
                        <v-chip-group mandatory v-model="activeAcademicYear" column>
                            <v-chip
                                v-for="(academicYear, index) in academicYears"
                                :key="index"
                                :value="academicYear"
                                color="primary"
                                class="ma-1"
                                variant="tonal"
                            >
                                {{ `${academicYear}-${academicYear + 1}` }}
                            </v-chip>
                        </v-chip-group>
                    </div>
                </v-card-text>
            </v-col>
            <v-col v-if="isInstructor && isStudent" cols="6">
                <v-checkbox
                    class="subject-checkbox"
                    v-model="showInstructorSubjects"
                    :label="$t('subjects.instructor_subjects')"
                ></v-checkbox>
                <v-checkbox
                    class="subject-checkbox"
                    v-model="showStudentSubjects"
                    :label="$t('subjects.student_subjects')"
                ></v-checkbox>
            </v-col>
        </v-row>
    </v-card>
</template>

<script setup lang="ts">
import { computed, ref, toRefs, watch } from "vue";
import useAcademicYear from "@/composables/useAcademicYear";
import { type SubjectDetails, type SubjectFilter, SubjectRole } from "@/models/Subject";

const props = defineProps<{
    academicYears: number[];
    subjects: SubjectDetails[];
}>();
const { academicYears, subjects } = toRefs(props);
const activeAcademicYear = ref(useAcademicYear());
const showInstructorSubjects = ref(true);
const showStudentSubjects = ref(true);

const activeSubjectFilter = computed(() => {
    return {
        showInstructorSubjects: showInstructorSubjects.value,
        showStudentSubjects: showStudentSubjects.value,
    };
});

const isInstructor = computed(() => {
    return subjects.value.some((subject) => subject.role === SubjectRole.Instructor);
});

const isStudent = computed(() => {
    return subjects.value.some((subject) => subject.role === SubjectRole.Student);
});

const emit = defineEmits<{
    (e: "academic-year-changed", academicYear: number): void;
    (e: "subjects-filter-changed", filter: SubjectFilter): void;
}>();

watch(activeAcademicYear, (newVal: number | undefined) => {
    if (newVal !== undefined) {
        emit("academic-year-changed", newVal);
        showInstructorSubjects.value = true;
        showStudentSubjects.value = true;
    }
});

watch(activeSubjectFilter, (newVal: SubjectFilter | undefined) => {
    if (newVal !== undefined) {
        emit("subjects-filter-changed", newVal);
    }
});
</script>

<style scoped>
.title-card {
    background-color: white;
    padding: 20px;
}

.title {
    font-size: 32px;
    letter-spacing: -0.5px;
    text-transform: capitalize;
    font-weight: bold;
    margin-bottom: 12px;
    font-family: "Poppins", sans-serif;
}

.chip-container {
    overflow-x: auto;
}

.subject-checkbox {
    margin-top: -15px;
}
</style>
