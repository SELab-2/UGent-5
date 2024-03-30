<template>
    <v-card>
        <v-card-item>
            <v-card-title>
                {{ project?.name }}
            </v-card-title>
            <v-card-subtitle>
                {{ subject?.name }}
            </v-card-subtitle>
        </v-card-item>
        <v-card-text v-if="!isLoading">
            <b>{{ $t("project.deadline") }}:</b>
            <p>{{ $d(project.deadline, "long") }}</p>
        </v-card-text>
        <v-card-actions>
            <v-btn>{{ $t("project.details_button") }}</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup lang="ts">
import { useProjectQuery } from "@/queries/Project";
import { computed } from "vue";
import { useSubjectQuery } from "@/queries/Subject";

const props = defineProps({
    projectId: Number,
});

const { data: project, isLoading } = useProjectQuery(computed(() => props.projectId));
const { data: subject } = useSubjectQuery(computed(() => project.value?.subject_id));
</script>

<style scoped></style>
