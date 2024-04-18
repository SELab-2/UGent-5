<template>
    <v-card>
        <v-skeleton-loader :loading="isSubjectLoading" type="article">
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
            <v-btn :to="`/project/${project.id}`">
                {{ $t("project.details_button") }}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup lang="ts">
import { useSubjectQuery } from "@/queries/Subject";
import { computed, toRefs } from "vue";
import type Project from "@/models/Project";

const props = defineProps<{
    project: Project;
}>();

const { project } = toRefs(props);

const { data: subject, isLoading: isSubjectLoading } = useSubjectQuery(
    computed(() => project.value.subject_id)
);
</script>

<style scoped></style>
