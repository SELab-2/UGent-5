<template>
    <v-card>
        <v-card-title>
            {{ $t("project.group", { number: submission.group_id }) }}
        </v-card-title>

        <SubmissionCard class="ma-3" :submission="submission" :deadline="deadline" />

        <v-card-actions>
            <v-btn :to="`/groups/${submission.group_id}/submissions`">
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
    deadline: string;
}>();

const { submission } = toRefs(props);
</script>
