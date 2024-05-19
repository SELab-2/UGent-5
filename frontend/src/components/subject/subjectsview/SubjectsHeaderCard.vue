<template>
    <v-card variant="flat" class="title-card">
        <div class="leftcontent">
            <v-card-title class="title">
                {{ $t("subjects.title") }}
            </v-card-title>
            <v-card-text>
                <div class="chip_container">
                    <v-chip-group mandatory v-model="activeAcademicYear" column>
                        <v-chip
                            v-for="(academicYear, index) in academicYears"
                            :key="index"
                            :value="academicYear"
                            class="ma-1 chip"
                            color="secondary"
                            variant="flat"
                        >
                            {{ `${academicYear}-${academicYear + 1}` }}
                        </v-chip>
                    </v-chip-group>
                </div>
            </v-card-text>
        </div>
        <div v-if="isInstructor && isStudent">
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
        </div>
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

.title-card{
    position: relative;
    display: flex;
    padding: 20px;
    color: white;
}
.title-card:after {
    content:'';
    background: url('@/assets/ugent_background.png') no-repeat center center;
    position: absolute;
    top:0;
    left: 0;
    width:100%;
    height:100%;
    z-index:-1;
    opacity: 0.4;
}

.title {
    font-size: 32px;
    margin-bottom: 12px;
}

.chip_container {
    overflow-x: auto;
}

.subject-checkbox {
    margin-top: -15px;
}


.chip {
    color: rgb(var(--v-theme-text));
    background-color: rgb(var(--v-theme-background));
}

.leftcontent {
    max-width: 400px;
}
</style>
