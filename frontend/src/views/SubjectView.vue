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

import {defineProps, toRefs,} from "vue";
import {useSubjectDetailsQuery} from "@/queries/Subject";

const props = defineProps(['subjectId'])

const {subjectId} = toRefs(props);

const {
    data: subject,
    error,
    isLoading,
    isError
} = useSubjectDetailsQuery(subjectId);

</script>
;
<style scoped>

</style>
