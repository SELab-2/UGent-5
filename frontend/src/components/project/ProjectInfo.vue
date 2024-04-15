<template>
    <BackgroundContainer>
        <v-col class="scrollable-container">
            <ProjectInfoCard :project="project"></ProjectInfoCard>
            <v-row>
                Downloadable files
                <SubmitInfo :projectId="project.id" :groupId="group"></SubmitInfo>
            </v-row>
        </v-col>
    </BackgroundContainer>
</template>

<script setup lang="ts">
import type Project from "@/models/Project";
import BackgroundContainer from "@/components/BackgroundContainer.vue";
import ProjectInfoCard from "@/components/project/ProjectInfoCard.vue";
import SubmitInfo from "@/components/project/submit/SubmitInfo.vue"
import {useUserGroupQuery} from "@/queries/Group";
import {toRefs} from "vue";

const props = defineProps<{
    project: Project;
}>();

const { project } = toRefs(props);

const { data : group, isError: isGroupError } = useUserGroupQuery(project?.value.id);

</script>

<style scoped>

.scrollable-container {
    max-height: 100%;
    overflow-y: auto;
}

</style>
