<template>
    <v-card>
        <v-card-item>
            <v-card-title>{{ $t("submit.submit_title") }}</v-card-title>
        </v-card-item>
        <h1 v-if="isError">Error</h1>
        <v-container v-else class="card-container">
            <v-row>
                <v-col>
                    <v-skeleton-loader :loading="isLoading" type="article">
                        <ProjectMiniCard :project="project!" />
                    </v-skeleton-loader>
                </v-col>
                <v-spacer />
                <v-spacer />
            </v-row>
            <v-row>
                <v-col>
                    <h1>
                        {{ $t("submit.add_files") }}
                    </h1>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <SubmitForm :projectId="projectId" />
                </v-col>
            </v-row>
        </v-container>
    </v-card>
</template>

<script setup lang="ts">
import ProjectMiniCard from "@/components/project/ProjectMiniCard.vue";
import SubmitForm from "@/components/project/submit/SubmitForm.vue";
import { useProjectQuery } from "@/queries/Project";
import { toRefs } from "vue";

const props = defineProps<{
    projectId: number;
}>();

const { projectId } = toRefs(props);

const { data: project, isLoading, isError } = useProjectQuery(projectId);
</script>

<style scoped>
.card-container {
    background-color: var(--gray-8);
}
</style>
