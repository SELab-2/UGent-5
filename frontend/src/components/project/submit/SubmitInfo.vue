<template>
    <v-card>
        <v-card-title>
            Submission Zone
        </v-card-title>
        <v-card-subtitle>
            Latest submission: {{ latestSubmission.status }}
        </v-card-subtitle>
        <router-link :to="`/projects/${projectId}/submit`">
            <v-btn>
                Submit new solution
            </v-btn>
        </router-link>
    </v-card>
</template>

<script setup lang="ts">
import {useSubmissionQuery} from "@/queries/Project";
import {toRefs} from "vue";

const props = defineProps<{
    groupId: number;
    projectId: number;
}>();

const { groupId } = toRefs(props);
const { projectId } = toRefs(props);

const { data: submissions, isError } = useSubmissionQuery();

const latestSubmission = submissions.filter(submission => submission.group_id === groupId.value && submission.project_id === projectId.value)

</script>

<style scoped>

</style>
