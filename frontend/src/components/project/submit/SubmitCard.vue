<template>
    <v-card variant="flat">
        <h1>{{ $t("submit.submit_title") }}</h1>
        <h1 v-if="isError">Error</h1>
        <v-skeleton-loader :loading="isLoading" type="article">
            <ProjectMiniCard :project="project!" class="minicard" />
        </v-skeleton-loader>
        <h2>
            {{ $t("submit.files") }}
        </h2>
        <SubmitForm :projectId="projectId" class="submitform" />
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
.minicard {
    margin: 15px 0 30px 0;
    width: 500px;
}
.submitform {
    margin-top: 15px;
}
</style>
