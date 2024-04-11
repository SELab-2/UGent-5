<template>
    <div v-if="isError" class="v-container">
        <p>Error: {{error}}</p>
    </div>

    <BackgroundContainer v-else>
        <SubjectsHeaderContainer :is-loading="isLoading"></SubjectsHeaderContainer>
        <SubjectCard
            v-for="subject in data?.subjects"
            :key="subject.id"
            :subject="subject"
        >

        </SubjectCard>
    </BackgroundContainer>

    <div
        class="v-container"
    >
        <ul class="pa-5">
            <li
                v-for="subject in data?.subjects"
                :key="subject.id"
            >
                <router-link :to="{ name: 'subject', params: { subjectId: subject.id }}">
                    {{ subject.name }}
                </router-link>
            </li>

        </ul>
    </div>

</template>

<script setup lang="ts">

import {useSubjectsQuery} from "@/queries/Subject";
import BackgroundContainer from "@/components/BackgroundContainer.vue";
import SubjectsHeaderContainer from "@/components/subjects/SubjectsHeaderContainer.vue";
import SubjectCard from "@/components/subjects/SubjectCard.vue";
import type Subject from "@/models/Subject";

const {data, error, isLoading, isError} = useSubjectsQuery() as { data: { subjects: Subject[] } };

</script>

<style scoped>

</style>
