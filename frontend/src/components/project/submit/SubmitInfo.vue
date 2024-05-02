<template>
    <v-card color="white">
        <v-card-title>
            {{ $t("submit.submissions") }}
        </v-card-title>
        <v-card-subtitle v-if="latestSubmission" class="subtitle">
            {{ $t("submit.latest_submission") }} {{ $d(latestSubmission.date, "long") }}
        </v-card-subtitle>
        <v-card-subtitle v-else class="subtitle">
            {{ $t("submit.no_submission") }}
        </v-card-subtitle>
        <v-card-text v-if="latestSubmission" class="subtitle">
            {{ $t("submit.status_submission", { status: getSubmissionStatus }) }}
        </v-card-text>
        <v-card-actions>
            <router-link :to="`/project/${project?.id}/submit`">
                <v-btn>
                    {{ $t("submit.new_submission") }}
                </v-btn>
            </router-link>
        </v-card-actions>
    </v-card>
</template>

<script setup lang="ts">
import { useSubmissionQuery } from "@/queries/Project";
import { toRefs, computed } from "vue";
import type Project from "@/models/Project";
import type Group from "@/models/Group";
import type Submission from "@/models/Submission";
import { SubmissionStatus } from "@/models/Submission";
import {useI18n} from "vue-i18n";

const props = defineProps<{
    group: Group;
    project: Project;
}>();

const { t } = useI18n();

const { group, project } = toRefs(props);

const { data: submissions } = useSubmissionQuery();

const latestSubmission = computed(() => {

    // Filter submissions for the specific group and project
    const filteredSubmissions = submissions.value?.filter(
        (submission: Submission) =>
            submission.group_id === group.value.id && submission.project_id === project.value.id
    );

    // Sort the filtered submissions by date in descending order
    const sortedSubmissions = filteredSubmissions?.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    // Return the latest submission (first item after sorting)
    return sortedSubmissions?.[0];
});

const getSubmissionStatus = computed(() => {
    if (latestSubmission.value) {
        const statusKey = SubmissionStatus[latestSubmission.value.status];
        return t("submit." + statusKey);
    } else {
        return "";
    }
});

</script>

<style scoped></style>
