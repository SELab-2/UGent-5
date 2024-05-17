<template>
    <div v-if="isError" class="v-container">Error...</div>
    <div v-else-if="isLoading">Loading...</div>

    <BackgroundContainer v-else>
        <v-row>
            <v-col>
                <SubjectHeaderContainer
                    v-if="subject"
                    :title="subject!.name"
                    :instructors="instructors!"
                    academic-year="2023-2024"
                    :is-loading="isLoading"
                    image-path="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
                ></SubjectHeaderContainer>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <SubjectBody
                    v-if="subject"
                    :projects="projects!"
                    :is-loading="isLoading"
                ></SubjectBody>
            </v-col>
        </v-row>
    </BackgroundContainer>
</template>

<script setup lang="ts">
import { computed, toRefs } from "vue";
import {
    useSubjectQuery,
    useSubjectProjectsQuery,
    useSubjectInstructorsQuery,
} from "@/queries/Subject";
import BackgroundContainer from "@/components/BackgroundContainer.vue";
import SubjectHeaderContainer from "@/components/subject/header/SubjectHeaderContainer.vue";
import SubjectBody from "@/components/subject/body/SubjectBody.vue";

const props = defineProps<{
    subjectId: number;
}>();

const { subjectId } = toRefs(props);

const {
    data: subject,
    isLoading: isSubjectLoading,
    isError: isSubjectError,
} = useSubjectQuery(subjectId);
const {
    data: projects,
    isLoading: isProjectsLoading,
    isError: isProjectsError,
} = useSubjectProjectsQuery(subjectId);
const {
    data: instructors,
    isLoading: isInstructorsLoading,
    isError: isInstructorsError,
} = useSubjectInstructorsQuery(subjectId);

const isLoading = computed(
    () => isSubjectLoading.value || isProjectsLoading.value || isInstructorsLoading.value
);
const isError = computed(
    () => isSubjectError.value || isProjectsError.value || isInstructorsError.value
);
</script>
;
<style scoped></style>
