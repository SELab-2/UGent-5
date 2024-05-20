<template>
    <v-card class="parent-card">
        <v-card-title>
            {{ $t("project.group", { number: submission.group_id }) }}
        </v-card-title>
        <SubmissionCard class="ma-3" :submission="submission" :deadline="deadline" />
        <v-card-actions>
            <v-btn :to="`/groups/${submission.group_id}`" class="button">
                {{ $t("project.submissions_list") }}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup lang="ts">
import SubmissionCard from "@/components/submission/SubmissionCard.vue";
import { toRefs } from "vue";

const props = defineProps<{
    submission: Submission;
    deadline: Date;
}>();

const { submission } = toRefs(props);
</script>

<style>
.v-card {
    border-color: rgb(var(--v-theme-text));
}

.parent-card {
    background-color: rgb(var(--v-theme-background));
    padding: 10px;
    width: 100%;
}

.button {
    background-color: rgb(var(--v-theme-secondary));
}
</style>
