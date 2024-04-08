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
            <BackgroundContainer>
                <SubjectHeaderCard
                    :title="subject?.name"
                    academic-year="2023-2024"
                    :instructors="subject?.instructors"
                    :isLoading="isLoading"
                >
                </SubjectHeaderCard>
            </BackgroundContainer>
        </div>

    </div>

</template>

<script setup lang="ts">

import {defineProps, toRefs,} from "vue";
import {useSubjectDetailsQuery} from "@/queries/Subject";
import BackgroundContainer from "@/components/BackgroundContainer.vue";
import SubjectHeaderCard from "@/components/cards/subject/SubjectHeaderCard.vue";
import type SubjectDetails from "@/models/SubjectDetails";

const props = defineProps(['subjectId'])

const {subjectId} = toRefs(props);

const {
    data: subject,
    error,
    isLoading,
    isError
} = useSubjectDetailsQuery(subjectId) as SubjectDetails;

</script>
;
<style scoped>

</style>
