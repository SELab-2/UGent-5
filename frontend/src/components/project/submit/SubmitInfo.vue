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
                $t("submit.status_submission", { status: Status[latestSubmission.status] })
            }}</v-card-text>
        </div>
        <v-card-actions>
            <v-btn :to="`/project/${project?.id}/submit`">
                {{ $t("submit.new_submission") }}
            </v-btn>
            <v-btn :to="`/groups/${group?.id}/submissions`">
                {{ $t("project.submissions_list") }}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup lang="ts">
import { useSubmissionsQuery } from "@/queries/Submission";
import { toRefs, computed } from "vue";
import type Project from "@/models/Project";
import type Group from "@/models/Group";
import { Status } from "@/models/Submission";

const props = defineProps<{
    group: Group;
    project: Project;
}>();

const { group, project } = toRefs(props);

const { data: submissions } = useSubmissionsQuery(computed(() => group.value.id));

const latestSubmission = computed(() => {
    let values = submissions.value?.toSorted((a, b) => new Date(b.date) - new Date(a.date));
    return values ? values[0] : undefined;
});
</script>

<style scoped>
.subtitle {
    margin-bottom: 10px; /* Adjust as needed */
}
</style>
