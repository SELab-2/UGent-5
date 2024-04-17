<template>
    <v-card color="white">
        <v-card-title>
            Submission Zone
        </v-card-title>
        <v-card-subtitle v-if="latestSubmission">
            Latest submission: {{ latestSubmission.status }}
        </v-card-subtitle>
        <v-card-subtitle v-else>
            No submissions found.
        </v-card-subtitle>
        <router-link :to="`/project/${project?.id}/submit`">
            <v-btn>
                Submit new solution
            </v-btn>
        </router-link>
    </v-card>
</template>

<script setup lang="ts">
import {useSubmissionQuery} from "@/queries/Project";
import {toRefs, computed} from "vue";
import type Project from "@/models/Project";
import type Group from "@/models/Group";
import type Submission from "@/models/Submission";

const props = defineProps<{
    group: Group;
    project: Project;
}>();

const { group } = toRefs(props);
const { project } = toRefs(props);

const { data: submissions, isLoading, isError } = useSubmissionQuery();

const latestSubmission = computed(() => submissions.value?.filter((submission: Submission) => {
    return submission.group_id === group.value.id && submission.project_id === project.value.id;
})[0]);

</script>

<style scoped>

</style>
