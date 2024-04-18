<template>
    <div v-if="isError" class="v-container">
        <p>Error: {{ error }}</p>
    </div>

    <BackgroundContainer v-else>
        <v-row>
            <v-col>
                <SubjectHeaderContainer
                    v-if="subject"
                    :title="subject!.name"
                    :instructors="subject!.instructors"
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
                    :projects="subject!.projects"
                    :is-loading="isLoading"
                ></SubjectBody>
            </v-col>
        </v-row>
    </BackgroundContainer>
</template>

<script setup lang="ts">
import { toRefs } from "vue";
import { useSubjectDetailsQuery } from "@/queries/Subject";
import BackgroundContainer from "@/components/BackgroundContainer.vue";
import SubjectHeaderContainer from "@/components/subject/header/SubjectHeaderContainer.vue";
import SubjectBody from "@/components/subject/body/SubjectBody.vue";

const props = defineProps<{
    subjectId: number;
}>();

const { subjectId } = toRefs(props);

const { data: subject, error, isLoading, isError } = useSubjectDetailsQuery(subjectId);
</script>
;
<style scoped></style>
