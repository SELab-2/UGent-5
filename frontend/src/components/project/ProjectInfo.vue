<template>
    <v-container>
        <ProjectInfoCard :project="project"></ProjectInfoCard>
        <SubmitInfo class="submitInfo" v-if="group" :project="project" :group="group" />
    </v-container>
</template>

<script setup lang="ts">
import type Project from "@/models/Project";
import type Group from "@/models/Group";
import ProjectInfoCard from "@/components/project/ProjectInfoCard.vue";
import SubmitInfo from "@/components/project/submit/SubmitInfo.vue";
import { toRefs } from "vue";

const props = defineProps<{
    project: Project;
    group: Group | null;
}>();

const { project, group } = toRefs(props);
</script>

<style scoped>

.submitInfo{
    padding: 10px;
    margin-top: 20px;
}
</style>
