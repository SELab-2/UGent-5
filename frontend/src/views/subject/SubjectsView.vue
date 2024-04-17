<template>
    <div v-if="isError" class="v-container">
        <p>Error: {{ error }}</p>
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
                    v-for="(subject, index) in data"
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

const { data, error, isLoading, isError } = useSubjectsQuery();
</script>

<style scoped></style>