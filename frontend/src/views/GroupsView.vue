<template>
    <v-container>
        <h1 v-if="isDataLoading" class="welcome">{{ $t("default.loading.loading_page") }}</h1>
        <h1 v-else-if="isDataError" class="welcome">{{ $t("default.error") }}</h1>
        <div v-else class="projectInfo">
            <h2> {{"Project: " + project.name}}</h2>
            <v-row>
                <v-col cols="8">Groups:</v-col>
                <v-col cols="2">Members:</v-col>
                <v-col cols="2">Actions:</v-col>
            </v-row>
            <GroupCard
                v-for="group in groups"
                :key="group.id"
                :project="project"
                :group="group"
                :user="user"
            />
        </div>
    </v-container>
    {{test}}
</template>

<script setup lang="ts">
import {useProjectGroupsQuery} from "@/queries/Group";
import {computed, toRefs} from "vue";
import {useProjectQuery} from "@/queries/Project";
import GroupCard from "@/components/home/cards/GroupCard.vue";
import {useUserQuery} from "@/queries/User";


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
    data: groups,
    isLoading: isGroupLoading,
    isError: isGroupError,
} = useProjectGroupsQuery(projectId);

const {
    data: user,
    isLoading: isUserLoading,
    isError: isUserError
} = useUserQuery(null);

const test = computed(() => groups)

const isDataLoading = computed(() => isProjectLoading.value || isGroupLoading.value || isUserLoading.value);

const isDataError = computed(() => isProjectError.value || isGroupError.value || isUserError.value);

</script>

<style scoped></style>
