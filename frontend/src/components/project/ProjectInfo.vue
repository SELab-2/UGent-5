<template>
    <BackgroundContainer>
        <v-col class="scrollable-container">
            <ProjectInfoCard :project="project"></ProjectInfoCard>
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

.scrollable-container {
    max-height: 100%;
    overflow-y: auto;
}

</style>
