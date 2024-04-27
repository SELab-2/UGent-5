<template>
    <v-container>
        <v-alert v-if="isError" title="Error" color="error" :text="error.message"></v-alert>
        <v-skeleton-loader v-else :loading="isLoading" type="card" color="white">
            <v-col class="mx-auto">
                <SubmissionCard
                    class="ma-3"
                    v-for="submission in sorted"
                    :key="submission"
                    :submission="submission"
                />
            </v-col>
        </v-skeleton-loader>
    </v-container>
</template>

<script setup lang="ts">
import { useSubmissionsQuery } from "@/queries/Group";
import { computed, toRefs } from "vue";
import SubmissionCard from "@/components/submission/SubmissionCard.vue";

const props = defineProps<{
    groupId: number;
}>();

const { groupId } = toRefs(props);

const { data: submissions, error, isLoading, isError, refetch } = useSubmissionsQuery(groupId);

const sorted = computed(() => {
    return submissions.value?.toSorted((a, b) => new Date(b.date) - new Date(a.date));
});

// While latest submission is in progress, keep refetching.
const refetch_timer = () => {
    setTimeout(() => {
        const list = sorted.value;
        if (list && list[0].status == 1) {
            refetch();
            refetch_timer();
        }
    }, 1000);
};
refetch_timer();
</script>
