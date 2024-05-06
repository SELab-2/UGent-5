<template>
    <v-container>
        <h1 v-if="isDataLoading" class="welcome">{{ $t("default.loading.loading_page") }}</h1>
        <h1 v-else-if="isDataError" class="welcome">{{ $t("default.error") }}</h1>
        <div v-else class="projectInfo">
            <v-row>
                <v-col cols="10">
                    <ProjectInfo :project="project!" :group="group!" />
                </v-col>
                <v-col cols="2" class="button-container">
                    <router-link :to="`/project/${projectId}/edit`">
                        <v-btn class="edit-button" color="primary" icon>
                            <v-icon left>mdi-pencil</v-icon>
                            {{ $t("project.edit_button") }}
                        </v-btn>
                    </router-link>
                    <router-link v-if="group" :to="`/api/groups/${group!.id}`">
                        <v-btn class="group-button" prepend-icon="mdi-account-group">
                            {{ $t("project.group", { number: group!.id }) }}
                        </v-btn>
                    </router-link>
                    <router-link v-else :to="`/projects/${projectId}/groups`">
                        <v-btn class="group-button" prepend-icon="mdi-account-group">
                            {{ $t("project.group_button") }}
                        </v-btn>
                    </router-link>
                    <NeedHelpButton class="group-button" :email="'test@test.be'"></NeedHelpButton>
                </v-col>
            </v-row>
        </div>
    </v-container>
</template>

<script setup lang="ts">
import ProjectInfo from "@/components/project/ProjectInfo.vue";

import { useProjectQuery } from "@/queries/Project";
import { computed, toRefs } from "vue";
import NeedHelpButton from "@/components/buttons/NeedHelpButton.vue";
import { useUserGroupQuery } from "@/queries/Group";

const props = defineProps<{
    projectId: number;
}>();

const { projectId } = toRefs(props);

const {
    data: project,
    isLoading: isProjectLoading,
    isError: isProjectError,
} = useProjectQuery(projectId);

const {
    data: group,
    isLoading: isGroupLoading,
    isError: isGroupError,
} = useUserGroupQuery(projectId);

const isDataLoading = computed(() => isProjectLoading.value || isGroupLoading.value);
const isDataError = computed(() => isProjectError.value || isGroupError.value);
</script>

<style scoped>
.button-container {
    margin-top: 20px;
}

.group-button {
    margin-bottom: 5px;
    min-width: auto;
}
</style>
