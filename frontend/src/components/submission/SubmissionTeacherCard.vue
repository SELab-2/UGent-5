<template>
    <v-card v-if="!isLoading" class="parent-card">
        <v-card-title>
            {{ $t("project.group", { number: group!.num }) }}
        </v-card-title>
        <SubmissionCard class="ma-3" :submission="submission" :deadline="deadline" />
        <v-divider class="divider" />
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
import type Submission from "@/models/Submission";
import { useGroupQuery } from "@/queries/Group";

const props = defineProps<{
    submission: Submission;
    deadline: Date;
}>();
const { submission } = toRefs(props);

const { data: group, isLoading } = useGroupQuery(() => submission.value.group_id);
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

.divider {
    margin-bottom: 10px;
}
</style>
