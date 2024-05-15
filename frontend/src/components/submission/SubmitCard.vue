<template>
    <v-skeleton-loader :loading="isLoading" type="article">
    <v-card>
        <v-card-item>
            <h1>{{ $t("submit.submit_title") }}</h1>
            <h1 v-if="isError">Error</h1>
            <ProjectMiniCard :project="project!" class="mini-card" />
        </v-card-item>
        <v-card-item>
            <SubmitForm :project="project!" class="submit-form" />
        </v-card-item>
    </v-card>
    </v-skeleton-loader>
</template>

<script setup lang="ts">
import ProjectMiniCard from "@/components/project/ProjectMiniCard.vue";
import SubmitForm from "@/components/submission/SubmitForm.vue";
import { useProjectQuery } from "@/queries/Project";
import { toRefs } from "vue";

const props = defineProps<{
    projectId: number;
}>();

const { projectId } = toRefs(props);

const { data: project, isLoading, isError } = useProjectQuery(projectId);
</script>

<style scoped>
.mini-card {
    margin: 15px 0 30px 0;
    width: 500px;
}
.submit-form {
    margin-top: 15px;
}
</style>
