<template>
    <v-container>
        <div class="submissionsview">
            <v-alert v-if="isError" title="Error" color="error" :text="error.message"></v-alert>
            <v-skeleton-loader v-else :loading="isLoading || !projectSuccess" type="card">
                <v-col>
                    <h2>{{ $t("submission.submissions_title") }}</h2>
                    <v-btn
                        :to="`/project/${project?.id}/submit`"
                        variant="flat"
                        class="submitbutton"
                    >
                        {{ $t("submit.new_submission") }}
                    </v-btn>
                    <div v-if="sorted.length == 0" class="nosubmissions">
                        <v-divider class="divider"></v-divider>
                        <p>{{ $t("submission.no_submissions") }}</p>
                    </div>
                    <SubmissionCard
                        class="ma-3"
                        v-for="submission in sorted"
                        :key="submission"
                        :submission="submission"
                        :project="project!"
                        :deadline="project.deadline"
                    />
                </v-col>
            </v-skeleton-loader>
        </div>
    </v-container>
</template>

<script setup lang="ts">
import { useGroupQuery } from "@/queries/Group";
import { useSubmissionsQuery } from "@/queries/Submission";
import { useProjectQuery } from "@/queries/Project";
import { computed, toRefs } from "vue";
import SubmissionCard from "@/components/submission/SubmissionCard.vue";

const props = defineProps<{
    groupId: number;
}>();

const { groupId } = toRefs(props);

const { data: submissions, error, isLoading, isError, refetch } = useSubmissionsQuery(groupId);
const { data: group } = useGroupQuery(groupId);
const { data: project, isSuccess: projectSuccess } = useProjectQuery(
    computed(() => group.value?.project_id)
);

const sorted = computed(() => {
    return submissions.value?.toSorted((a, b) => new Date(b.date) - new Date(a.date));
});

// While latest submission is in progress, keep refetching.
const refetch_timer = () => {
    setTimeout(() => {
        const list = sorted.value;
        if (list && list.length > 0 && list[0].status == 1) {
            refetch();
            refetch_timer();
        }
    }, 1000);
};
refetch_timer();
</script>
<style scoped>
.nosubmissions {
    margin-top: 15px;
}

.submitbutton {
    margin-top: 25px;
    margin-bottom: 15px;
    background-color: rgb(var(--v-theme-secondary));
    border-color: rgb(var(--v-theme-text));
}

.divider {
    margin-bottom: 15px;
}
</style>
