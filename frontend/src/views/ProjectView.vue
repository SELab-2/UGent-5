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
                        <v-btn prepend-icon="mdi-account-group">
                            Join Group
                        </v-btn>
                    </router-link>
                    <NeedHelpButton :email="'test@test.be'"></NeedHelpButton>
                </v-col>
            </v-row>
        </div>
    </v-container>
</template>

<script setup lang="ts">
import ProjectInfo from "@/components/project/ProjectInfo.vue";

import { useProjectQuery } from "@/queries/Project";
import { toRefs } from "vue";
import NeedHelpButton from "@/components/buttons/NeedHelpButton.vue";
import {useUserGroupQuery} from "@/queries/Group";

const props = defineProps<{
    projectId: number;
}>();

const { projectId } = toRefs(props);

const { data: project, isLoading, isError } = useProjectQuery(projectId);

const { data2 : group, isError2 } = useUserGroupQuery(projectId);
</script>

<style scoped>


</style>
