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
                <v-row>
                    <v-col>
                        <SubjectHeaderContainer
                            :title="subject?.name"
                            :instructors="subject?.instructors"
                            academic-year="2023-2024"
                            :is-loading="isLoading"
                            image-path="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
                        ></SubjectHeaderContainer>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <SubjectBodyCard :projects="subject?.projects ?? []"></SubjectBodyCard>
                    </v-col>
                </v-row>


            </BackgroundContainer>
        </div>

    </div>

</template>

<script setup lang="ts">

import {defineProps, toRefs,} from "vue";
import {useSubjectDetailsQuery} from "@/queries/Subject";
import BackgroundContainer from "@/components/BackgroundContainer.vue";
import type SubjectDetails from "@/models/SubjectDetails";
import SubjectHeaderContainer from "@/components/subject/header/SubjectHeaderContainer.vue";
import SubjectBodyCard from "@/components/subject/body/SubjectBodyCard.vue";

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
