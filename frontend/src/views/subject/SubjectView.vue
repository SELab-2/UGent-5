<template>
    <div v-if="isError" class="v-container">
        <p>Error: {{ error }}</p>
    </div>

    <v-row v-else>
        <v-col cols="1">
            <router-link :to="{ name: 'subjects'}">
                <v-btn variant="elevated" class="back-button" rounded="xl" size="large">
                    <v-icon>mdi-arrow-left</v-icon>
                </v-btn>
            </router-link>
        </v-col>
        <v-col>
            <BackgroundContainer>
                <v-row>
                    <v-col>
                        <SubjectHeaderContainer
                            v-if="subject"
                            :title="subject!.name"
                            :instructors="subject!.instructors"
                            academic-year="2023-2024"
                            :is-loading="isLoading"
                            image-path="https://www.ugent.be/img/dcom/faciliteiten/ufo-logo.png"
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
        </v-col>
        <v-col cols="2">
            <div class="action-btn-container">
                <router-link to="">
                    <v-btn prepend-icon="mdi-plus-circle">
                        Create project
                    </v-btn>
                </router-link>
                <router-link to="">
                    <v-btn prepend-icon="mdi-content-copy">
                        Register link
                        <v-tooltip
                            activator="parent"
                            location="start"
                            max-width="200vw"
                        >
                            Copy register link for this subject, this can be shared with students to register for the subject.
                        </v-tooltip>
                    </v-btn>
                </router-link>
            </div>
        </v-col>
    </v-row>


</template>

<script setup lang="ts">
import {toRefs} from "vue";
import {useSubjectDetailsQuery} from "@/queries/Subject";
import BackgroundContainer from "@/components/BackgroundContainer.vue";
import SubjectHeaderContainer from "@/components/subject/header/SubjectHeaderContainer.vue";
import SubjectBody from "@/components/subject/body/SubjectBody.vue";
import ActionButton from "@/components/buttons/ActionButton.vue";
import NavButton from "@/components/navigation/NavButton.vue";

const props = defineProps<{
    subjectId: number;
}>();

const {subjectId} = toRefs(props);

const {data: subject, error, isLoading, isError} = useSubjectDetailsQuery(subjectId);
</script>
;
<style scoped>

.back-button {
    margin: 30px;
}

.action-btn-container {
    margin-top: 30px;
}
</style>
