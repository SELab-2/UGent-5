<template>
    <v-container>
        <v-alert v-if="isError" title="Error" color="error" :text="error.message"></v-alert>
        <v-skeleton-loader v-else :loading="projectLoading || submissionsLoading" type="card">
            <v-col class="mx-auto">
                <h1>{{ $t("submission.submissions_title", { project: project.name }) }}</h1>
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
</script>
