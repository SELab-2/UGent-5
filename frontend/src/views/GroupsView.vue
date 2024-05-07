<template>
    <v-container>
        <h1 v-if="isDataLoading" class="welcome">{{ $t("default.loading.loading_page") }}</h1>
        <h1 v-else-if="isDataError" class="welcome">{{ $t("default.error") }}</h1>
        <div v-else class="projectInfo">
            <h2>{{ "Project: " + project.name }}</h2>
            <v-row>
                <v-col cols="8">{{ $t("group.groups") }}</v-col>
                <v-col cols="2">{{ $t("group.members") }}</v-col>
                <v-col cols="2">{{ $t("group.actions") }}</v-col>
            </v-row>
            <GroupCard
                v-for="group in groups"
                :key="group.id"
                :project="project"
                :group="group"
                :user="user"
                :groups="groups"
                class="group-card"
            />
            <v-btn v-if="isTeacher" @click="createGroupMutation">{{
                $t("group.create_group")
            }}</v-btn>
        </div>
    </v-container>
</template>

<script setup lang="ts">
import {
    useCreateGroupsMutation,
    useJoinGroupUserMutation,
    useProjectGroupsQuery,
} from "@/queries/Group";
import { computed, toRefs } from "vue";
import { useProjectQuery } from "@/queries/Project";
import GroupCard from "@/components/home/cards/GroupCard.vue";
import { useUserQuery } from "@/queries/User";
import { GroupForm } from "@/models/Group";

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

const { data: user, isLoading: isUserLoading, isError: isUserError } = useUserQuery(null);

const isDataLoading = computed(
    () => isProjectLoading.value || isGroupLoading.value || isUserLoading.value
);

const isDataError = computed(() => isProjectError.value || isGroupError.value || isUserError.value);

const isTeacher = computed(() => user?.value.is_teacher || false);

const { mutateAsync: createGroup } = useCreateGroupsMutation();

const createGroupMutation = async () => {
    const groupForm: GroupForm = {
        project_id: project.value.id,
        score: 0,
        team_name: "Group " + groups.value.length, // Set the default team name or prompt the user for input
    };

    try {
        await createGroup({ projectId: projectId.value, groups: [groupForm] });
    } catch (error) {
        console.error("Error creating group:", error);
        alert("Could not create group. Please try again.");
    }
};
</script>

<style scoped>
.group-card {
    height: 50px; /* Adjust the height as needed */
    margin-bottom: 5px; /* Add margin to separate cards */
    display: flex; /* Use flexbox */
    align-items: center; /* Center items vertically */
}
</style>
