<template>
    <div v-if="isError" class="v-container">
        <p>Error: {{ error }}</p>
    </div>
    <div v-if="isLoading">
        Loading...
    </div>

    <BackgroundContainer v-else>
        <v-row>
            <v-col>
                <SubjectsHeaderContainer :is-loading="isLoading"></SubjectsHeaderContainer>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <SubjectCard
                    v-for="(subject, index) in subjectsList"
                    :subject="subject"
                    :is-loading="isLoading"
                    :key="index"
                >
                </SubjectCard>
            </v-col>
        </v-row>
    </BackgroundContainer>
</template>

<script setup lang="ts">
import { useSubjectsQuery } from "@/queries/Subject";
import BackgroundContainer from "@/components/BackgroundContainer.vue";
import SubjectsHeaderContainer from "@/components/subjects/SubjectsHeaderContainer.vue";
import SubjectCard from "@/components/subjects/SubjectCard.vue";
import {computed} from "vue";

const { data: subjects, error, isLoading, isError } = useSubjectsQuery();
const subjectsList = computed(() => {
    return [...subjects.value!.as_student, ...subjects.value!.as_instructor] || [];
});
</script>

<style scoped></style>
