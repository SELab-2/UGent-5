<template>
    <v-container>
        <h1 v-if="isLoading" class="welcome">Loading...</h1>
        <h1 v-else-if="isError" class="welcome">No such project found!</h1>
        <div v-else class="projectInfo">
            <v-row>
                <v-col cols="10">
                    <ProjectInfo :project="project!" />
                </v-col>
                <v-col cols="2">
                    <router-link :to="`/projects/${projectId}/groups`">
                        <button>Go to Groups</button>
                    </router-link>
                    <h1>"ask question placeholder"</h1>
                </v-col>
            </v-row>
        </div>
    </v-container>
</template>

<script setup lang="ts">
import ProjectInfo from "@/components/project/ProjectInfo.vue";
import { useProjectQuery } from "@/queries/Project";
import { toRefs } from "vue";

const props = defineProps<{
    projectId: number;
}>();

const { projectId } = toRefs(props);

const { data: project, isLoading, isError } = useProjectQuery(projectId);
</script>

<style scoped></style>
