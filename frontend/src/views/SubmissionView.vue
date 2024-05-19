<template>
    <v-container>
        <v-alert v-if="isError" title="Error" color="error" :text="error.message"></v-alert>
        <v-skeleton-loader v-else :loading="isLoading" type="card">
            <SubmissionCard :submission="submission" />
        </v-skeleton-loader>
    </v-container>
</template>

<script setup lang="ts">
import { useSubmissionQuery } from "@/queries/Submission";
import { toRefs } from "vue";
import SubmissionCard from "@/components/submission/SubmissionCard.vue";

const props = defineProps<{
    submissionId: number;
}>();

const { submissionId } = toRefs(props);

const { data: submission, error, isLoading, isError } = useSubmissionQuery(submissionId);
</script>

<style scoped>
.button-container {
    margin-top: 20px;
}

.group-button {
    margin-bottom: 5px;
    min-width: auto;
}
</style>
