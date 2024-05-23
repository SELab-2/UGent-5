<template>
    <BackgroundContainer>
        <v-col class="scrollable-container">
            <ProjectInfoCard :project="project"></ProjectInfoCard>
            <div class="download-section">
                <div class="half-width">
                    <h2>Downloadable files</h2>
                </div>
                <div class="half-width">
                    <SubmitInfo v-if="group" :project="project" :group="group" />
                </div>
            </div>
        </v-col>
    </BackgroundContainer>
</template>

<script setup lang="ts">
import type Project from "@/models/Project";
import type Group from "@/models/Group";
import BackgroundContainer from "@/components/BackgroundContainer.vue";
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
.scrollable-container {
    max-height: 100%;
    overflow-y: auto;
}

.download-section {
    margin-top: 20px; /* Adjust the margin-top value as needed */
    display: flex;
    width: 100%;
}

.half-width {
    width: 50%;
    box-sizing: border-box;
}
</style>
