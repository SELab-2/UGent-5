<template>
    <v-card @click="toProject" variant="flat">
        <v-skeleton-loader :loading="isSubjectLoading" type="article">
            <v-col cols="9">
                <v-card-title>
                    {{ project?.name }}
                </v-card-title>
                <v-card-subtitle>
                    {{ subject?.name }}
                </v-card-subtitle>
            </v-col>
            <v-col cols="3" class="deadline">
                <b>{{ $t("project.deadline") }}:</b>
                <p>{{ $d(project!.deadline, "long") }}</p>
            </v-col>
        </v-skeleton-loader>
    </v-card>
</template>

<script setup lang="ts">
import { useSubjectQuery } from "@/queries/Subject";
import { computed, toRefs } from "vue";
import type Project from "@/models/Project";
import router from "@/router";

const props = defineProps<{
    project: Project;
}>();

const { project } = toRefs(props);

const { data: subject, isLoading: isSubjectLoading } = useSubjectQuery(
    computed(() => project.value.subject_id)
);

const toProject = async () => {
    await router.push({ name: "project", params: { projectId: project.value.id } });
};
</script>

<style scoped>
.v-card,
.v-skeleton-loader {
    width: 100%;
    background-color: rgb(var(--v-theme-secondary));
}
</style>
