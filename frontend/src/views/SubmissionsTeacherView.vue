<template>
    <v-container>
        <v-alert v-if="isError" title="Error" color="error" :text="error.message"></v-alert>
        <v-skeleton-loader v-else :loading="projectLoading || submissionsLoading" type="card">
            <v-col class="mx-auto">
                <h1>{{ $t("submission.submissions_title", { project: project.name }) }}</h1>

                <v-btn class="primary-button" @click="downloadAll" prepend-icon="mdi-download">
                    {{ $t("project.submissions_zip") }}
                </v-btn>

                <v-alert v-if="submissions.length == 0" icon="$warning" color="warning">
                    {{ $t("submission.no_submissions") }}</v-alert
                >
                <v-alert v-else icon="$info" color="info" closable>
                    {{ $t("submission.teacher_submissions_info") }}</v-alert
                >

                <SubmissionTeacherCard
                    class="ma-3"
                    v-for="submission in submissions"
                    :key="submission"
                    :submission="submission"
                    :deadline="project.deadline"
                />
            </v-col>
        </v-skeleton-loader>
    </v-container>
</template>

<script setup lang="ts">
import { useProjectQuery } from "@/queries/Project";
import { useProjectSubmissionsQuery } from "@/queries/Submission";
import { toRefs } from "vue";
import SubmissionTeacherCard from "@/components/submission/SubmissionTeacherCard.vue";
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
</style>
