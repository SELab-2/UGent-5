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
            <h1>kak</h1>
        </div>

    </div>

</template>

<script setup lang="ts">

import {computed, defineProps, ref, toRefs, watchEffect} from "vue";
import {
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
} = useSubjectQuery(subjectId);


const {
    data: instructors,
    error: instructorsErr,
    isLoading: isInstructorsLoading,
    isError: isInstructorsErr
} = useSubjectInstructorsQuery(subjectId);





// Initialize reactive variables with default values
const isLoading = ref<boolean>(false);
const isError = ref<boolean>(false);
const error = ref<string>('');



</script>
;
<style scoped>

</style>
