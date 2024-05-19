<template>
    <v-container>
        <div class="submissionsview">
            <v-alert v-if="isError" title="Error" color="error" :text="error.message"></v-alert>
            <v-skeleton-loader v-else :loading="isLoading || !projectSuccess" type="card">
                <v-col class="col-sm-12 col-md-6 col-lg-8">
                    <h1>{{ $t("submission.submissions_title", { project: project.name }) }}</h1>
                    <v-btn :to="`/project/${project?.id}/submit`" variant="flat" class="submitbutton">
                        {{ $t("submit.new_submission") }}
                    </v-btn>
                    <v-divider />
                    <div v-if="sorted.length == 0" class="nosubmissions">
                        <p>{{ $t("submission.no_submissions") }}</p>
                    </div>
                    <SubmissionCard
                        class="ma-3"
                        v-for="submission in sorted"
                        :key="submission"
                        :submission="submission"
                        :project="project!"
                    />
                </v-col>
                <v-col cols="2" class="backbutton">
                    <BackButton class="back" :destination="`/project/${project.id}`" title="project.to_project"/>
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
import BackButton from "@/components/buttons/BackButton.vue"

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
}

.back{
    margin: 25px;
    float: left;
}
</style>
