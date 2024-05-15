<template>
    <v-card variant="text" class="title-card" rounded="xl" width="100%">
        <v-row>
            <v-col>
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
                                color="primary"
                                class="ma-1"
                                variant="tonal"
                            >
                                {{ academicYear - 1 + "-" + academicYear }}
                            </v-chip>
                        </v-chip-group>
                    </div>
                </v-card-text>
            </v-col>
            <v-col cols="3">
                <v-checkbox
                    class="align-right"
                    v-model="showInstructorSubjects"
                >
                    instructor vakken
                </v-checkbox>
                <v-checkbox
                    class="align-right"
                    v-model="showStudentSubjects"
                >
                    student vakken
                </v-checkbox>
            </v-col>
        </v-row>
    </v-card>
</template>

<script setup lang="ts">
import { ref, toRefs, watch } from "vue";
import useAcademicYear from "@/composables/useAcademicYear";

const props = defineProps<{
    academicYears: number[];
}>();
const { academicYears } = toRefs(props);
const activeAcademicYear = ref(useAcademicYear());
const showInstructorSubjects = ref(true);
const showStudentSubjects = ref(true);

const emit = defineEmits<{
    (e: "academic-year-changed", academicYear: number): void;
}>();

watch(activeAcademicYear, (newVal: number | undefined) => {
    if (newVal !== undefined) {
        emit("academic-year-changed", newVal);
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

.chip_container {
    overflow-x: auto;
}
</style>
