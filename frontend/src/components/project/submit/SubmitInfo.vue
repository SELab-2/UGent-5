<template>
    <v-card color="white">
        <v-card-title>
            {{ $t("submit.submissions") }}
        </v-card-title>
        <v-card-subtitle v-if="latestSubmission" class="subtitle">
            {{ $t("submit.latest_submission") }} {{ $d(latestSubmission.date, "long") }}
        </v-card-subtitle>
        <v-card-subtitle v-else class="subtitle"> No submissions found. </v-card-subtitle>
        <div v-if="latestSubmission" class="subtitle">
            <v-card-text>{{
                $t("submit.status_submission", { status: latestSubmission.status })
            }}</v-card-text>
        </div>
        <router-link :to="`/project/${project?.id}/submit`">
            <v-btn>
                {{ $t("submit.new_submission") }}
            </v-btn>
        </router-link>
    </v-card>
</template>

<script setup lang="ts">
import { useSubmissionQuery } from "@/queries/Project";
import { toRefs, computed } from "vue";
import type Project from "@/models/Project";
import type Group from "@/models/Group";
import type Submission from "@/models/Submission";

const props = defineProps<{
    group: Group;
    project: Project;
}>();

const { group, project } = toRefs(props);

const { data: submissions } = useSubmissionQuery();

const latestSubmission = computed(
    () => submissions.value?.filter((submission: Submission) => submission.group_id === group.value.id && submission.project_id === project.value.id)[0]
);
</script>

<style scoped>
.subtitle {
    margin-bottom: 10px; /* Adjust as needed */
}
</style>
