<template>
    <v-container>
        <v-alert v-if="isError" title="Error" color="error" :text="error.message"></v-alert>
        <v-row v-else>
            <v-col class="col-sm-12 col-md-6 col-lg-8">
                <v-skeleton-loader
                    :loading="projectLoading || submissionsLoading"
                    type="card"
                    class="card"
                >
                    <v-card-title class="title">{{
                        $t("submission.submissions_title", { project: project.name })
                    }}</v-card-title>
                    <v-card-subtitle v-if="submissions.length == 0" class="subtitle">{{
                        $t("submission.no_submissions")
                    }}</v-card-subtitle>
                    <div v-else>
                        <v-card-subtitle class="subtitle">{{
                            $t("submission.teacher_submissions_info")
                        }}</v-card-subtitle>
                        <v-btn
                            class="primary-button"
                            @click="downloadAll"
                            prepend-icon="mdi-download"
                        >
                            {{ $t("project.submissions_zip") }}
                        </v-btn>
                    </div>
                    <SubmissionTeacherCard
                        class="ma-3"
                        v-for="submission in submissions"
                        :key="submission.id"
                        :submission="submission"
                        :deadline="project.deadline"
                    />
                </v-skeleton-loader>
            </v-col>
            <v-col cols="2" class="backbutton">
                <BackButton title="project.to_project" :destination="`/project/${projectId}`" />
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { useProjectQuery } from "@/queries/Project";
import { useProjectSubmissionsQuery } from "@/queries/Submission";
import { toRefs } from "vue";
import SubmissionTeacherCard from "@/components/submission/SubmissionTeacherCard.vue";
import BackButton from "@/components/buttons/BackButton.vue";
import { download_file } from "@/utils";

const props = defineProps<{
    projectId: number;
}>();

const { projectId } = toRefs(props);

const {
    data: submissions,
    isLoading: submissionsLoading,
    isError,
    error,
} = useProjectSubmissionsQuery(projectId);
const { data: project, isLoading: projectLoading } = useProjectQuery(projectId);

const downloadAll = () => {
    download_file(`/api/projects/${projectId.value}/zip`, `project_${projectId.value}`);
};
</script>

<style scoped>
.primary-button {
    margin-bottom: 5px;
    min-width: 150px;
    background-color: rgb(var(--v-theme-primary));
    color: rgb(var(--v-theme-navtext));
}

.card {
    background-color: rgb(var(--v-theme-secondary));
    margin-top: 25px;
    padding: 15px;
}

.title,
.subtitle {
    width: 100%;
}

.backbutton {
    margin-top: 30px;
}

.primary-button {
    margin: 15px;
}
</style>
