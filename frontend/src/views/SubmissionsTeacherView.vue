<template>
    <v-container>
        <v-alert v-if="isError" title="Error" color="error" :text="error.message"></v-alert>
        <v-skeleton-loader v-else :loading="projectLoading || groupsLoading" type="card">
            <v-col class="mx-auto">
                <h1>{{ $t("submission.submissions_title", { project: project.name }) }}</h1>
                <div v-if="submissions.length == 0">
                    <p>{{ $t("submission.no_submissions") }}</p>
                </div>

                <SubmissionTeacherCard
                    class="ma-3"
                    v-for="submission in submissions"
                    :key="submission"
                    :submission="submission"
                    :deadline="project.deadline"
                />
            </v-col>
        </v-skeleton-loader>
    </v-container>
</template>

<script setup lang="ts">
import { useProjectQuery } from "@/queries/Project";
import { useSubmissionsQuery, useProjectGroupsQuery } from "@/queries/Group";
import { computed, toRefs } from "vue";
import SubmissionTeacherCard from "@/components/submission/SubmissionTeacherCard.vue";

const props = defineProps<{
    projectId: number;
}>();

const { projectId } = toRefs(props);


const { data: project, isLoading: projectLoading } = useProjectQuery(projectId);

const { data: groups, error, isLoading: groupsLoading, isError} = useProjectGroupsQuery(projectId);

const submissions = computed(() => {
    return groups.value?.map(group => {
        const { data: submissions} = useSubmissionsQuery(group.id);
        const sorted = computed(() => {
            return submissions.value?.toSorted((a, b) => new Date(b.date) - new Date(a.date));
        });
        return sorted.value?.first();
    });
});


</script>
