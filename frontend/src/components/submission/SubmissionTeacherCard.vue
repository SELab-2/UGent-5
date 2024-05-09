<template>
    <v-card>
        <v-card-title>
            {{ $t("submission.status") }}
        </v-card-title>
        <v-card-subtitle>
            {{ $t("submission.datetime") }} {{ $d(submission.date, "long") }}
        </v-card-subtitle>

        <SubmissionCard
            class="ma-3"
            :submission="submission"
            :deadline="deadline"
        />
    </v-card>
</template>

<script setup lang="ts">
import SubmissionCard from "@/components/submission/SubmissionCard.vue";
import { toRefs, computed } from "vue";

const props = defineProps<{
    submission: Submission;
    deadline: string;
}>();

const { submission } = toRefs(props);

</script>
