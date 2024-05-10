<template>
    <v-skeleton-loader :loading="isLoading" type="article">
    <v-card>
        <v-card-item>
            <h1>{{ $t("submit.submit_title") }}</h1>
            <h1 v-if="isError">Error</h1>
            <ProjectMiniCard :project="project" class="minicard" />
        </v-card-item>
        <v-card-item>
            <h2>

            </h2>
            <RequirementsList :requirements=project.requirements class="requirementslist"/>
        </v-card-item>
        <v-card-item>
            <h2>
                {{ $t("submit.files") }}
            </h2>
            <SubmitForm :projectId="projectId" class="submitform" />
        </v-card-item>
    </v-card>
    </v-skeleton-loader>
</template>

<script setup lang="ts">
import ProjectMiniCard from "@/components/project/ProjectMiniCard.vue";
import SubmitForm from "@/components/submission/SubmitForm.vue";
import { useProjectQuery } from "@/queries/Project";
import { toRefs } from "vue";
import RequirementsList from "@/components/project/RequirementsCard.vue";

const props = defineProps<{
    projectId: number;
}>();

const { projectId } = toRefs(props);

const { data: project, isLoading, isError } = useProjectQuery(projectId);
</script>

<style scoped>
.minicard {
    margin: 15px 0 30px 0;
    width: 500px;
}
.submitform {
    margin-top: 15px;
}
</style>
