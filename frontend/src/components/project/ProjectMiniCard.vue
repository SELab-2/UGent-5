<template>
    <v-card>
        <v-skeleton-loader :loading="isProjectLoading || isSubjectLoading" type="article">
            <v-card-item>
                <v-card-title>
                    {{ project?.name }}
                </v-card-title>
                <v-card-subtitle>
                    {{ subject?.name }}
                </v-card-subtitle>
            </v-card-item>
            <v-card-text>
                <b>{{ $t("project.deadline") }}:</b>
                <p>{{ $d(project!.deadline, "long") }}</p>
            </v-card-text>
        </v-skeleton-loader>
        <v-card-actions>
            <v-btn>{{ $t("project.details_button") }}</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup lang="ts">
import { useProjectQuery } from "@/queries/Project";
import { useSubjectQuery } from "@/queries/Subject";
import { computed, toRefs } from "vue";

const props = defineProps<{
    projectId: number;
}>();

const { projectId } = toRefs(props);

const { data: project, isLoading: isProjectLoading } = useProjectQuery(projectId);
const { data: subject, isLoading: isSubjectLoading } = useSubjectQuery(
    computed(() => project.value?.subject_id)
);
</script>

<style scoped></style>
<style scoped></style>
