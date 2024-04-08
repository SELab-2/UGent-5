<template>
    <div class="v-container">
        <router-link to="/subjects">Back</router-link>

        <div v-if="isLoading" class="v-container">
            <p>Loading...</p>
        </div>

        <div v-else-if="isError" class="v-container">
            <p>Error: {{ error }}</p>
        </div>

        <div class="v-container">
            <h1>{{ subject?.name }}</h1>
        </div>

    </div>

</template>

<script setup lang="ts">

import {computed, defineProps, toRefs} from "vue";
import {
    useSubjectDetailsQuery,
    useSubjectInstructorsQuery,
    useSubjectProjectsQuery,
    useSubjectQuery,
    useSubjectStudentsQuery
} from "@/queries/Subject";

const props = defineProps(['subjectId'])

const {subjectId} = toRefs(props);

const {
    data: subject,
    error: subjectErr,
    isLoading: isSubjectLoading,
    isError: isSubjectErr
} = useSubjectQuery(subjectId)

const {
    data: instructorsData,
    error: instructorsErr,
    isLoading: isInstructorsLoading,
    isError: isInstructorsErr
} = useSubjectInstructorsQuery(subjectId)

const {
    data: studentsData,
    error: studentsErr,
    isLoading: isStudentsLoading,
    isError: isStudentsErr
} = useSubjectStudentsQuery(subjectId)

const {
    data: projectsData,
    error: projectsErr,
    isLoading: isProjectsLoading,
    isError: isProjectsErr
} = useSubjectProjectsQuery(subjectId)


const isLoading = computed(() =>
    isSubjectLoading || isInstructorsLoading || isStudentsLoading || isProjectsLoading
)

const isError = computed(() =>
    isSubjectErr || isInstructorsErr || isStudentsErr || isProjectsErr
)

const error = computed(() =>
    subjectErr || instructorsErr || studentsErr || projectsErr
)


</script>
;
<style scoped>

</style>
