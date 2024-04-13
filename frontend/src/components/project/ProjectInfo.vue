<template>
    <BackgroundContainer>
        <v-col class="scrollable-container">
            <ProjectInfoCard :project="project" class="scrollable-container"></ProjectInfoCard>
        </v-col>
    </BackgroundContainer>
</template>

<script setup lang="ts">
import type Project from "@/models/Project";
import BackgroundContainer from "@/components/BackgroundContainer.vue";
import ProjectInfoCard from "@/components/project/ProjectInfoCard.vue";

const props = defineProps<{
    project: Project;
}>();

</script>

<style scoped>
.background-container {
    padding-bottom: 20px; /* Add padding to the bottom */
}

.scrollable-container {
    max-height: calc(100% - 20px);
    overflow-y: auto;
}

.scrollable-container .content {
    white-space: nowrap; /* Prevent text from wrapping */
    overflow: hidden; /* Hide overflowing content */
    text-overflow: ellipsis; /* Display ellipsis (...) for overflowed text */
}
</style>
