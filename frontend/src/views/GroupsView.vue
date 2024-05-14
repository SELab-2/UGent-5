<template>
    <v-container>
        <h1 v-if="isDataLoading" class="welcome">{{ $t("default.loading.loading_page") }}</h1>
        <h1 v-else-if="isDataError" class="welcome">{{ $t("group.error") }}</h1>
        <div v-else class="projectInfo">
            <h2>{{ "Project: " + project!.name }}</h2>
            <div v-if="groups.length > 0">
                <v-row>
                    <v-col cols="8">{{ $t("group.groups") }}</v-col>
                    <v-col cols="2">{{ $t("group.members") }}</v-col>
                    <v-col cols="2">{{ $t("group.actions") }}</v-col>
                </v-row>
                <AllstudentsDialog :students="allStudents" />
                <GroupCard
                    v-for="group in groups"
                    :key="group.id"
                    :project="project!"
                    :group="group"
                    :user="user!"
                    class="group-card"
                />
            </div>
            <div v-else>
                <v-row>
                    <v-col cols="8"> {{ $t("group.not_found2") }}</v-col>
                </v-row>
            </div>
            <v-btn v-if="isTeacher" @click="createGroup">{{ $t("group.create_group") }}</v-btn>
        </div>
    </v-container>
</template>

<script setup lang="ts">
import { useCreateGroupsMutation, useProjectGroupsQuery } from "@/queries/Group";
import { computed, toRefs } from "vue";
import { useProjectQuery } from "@/queries/Project";
import GroupCard from "@/components/home/cards/GroupCard.vue";
import { useUserQuery } from "@/queries/User";
import { type GroupForm } from "@/models/Group";
import { useSubjectStudentsQuery } from "@/queries/Subject";
import AllstudentsDialog from "@/components/AllstudentsDialog.vue";

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

const {
    data: allStudents,
    isLoading: isUsersLoading,
    isError: isUsersError,
} = useSubjectStudentsQuery(computed(() => project.value?.subject_id));

const isDataLoading = computed(
    () =>
        isProjectLoading.value ||
        isGroupLoading.value ||
        isUserLoading.value ||
        isUsersLoading.value
);

const isDataError = computed(
    () => isProjectError.value || isGroupError.value || isUserError.value || isUsersError.value
);

const isTeacher = computed(() => user.value?.is_teacher || false);

const { mutateAsync: createGroupMutate } = useCreateGroupsMutation();

async function createGroup() {
    const groupForm: GroupForm = {
        project_id: project.value!.id,
        score: 0,
        team_name: "Group " + groups.value!.length, // Set the default team name or prompt the user for input
    };

    try {
        await createGroupMutate({ projectId: projectId.value, groups: [groupForm] });
    } catch (error) {
        alert("Could not create group. Please try again.");
    }
}
</script>

<style scoped>
.group-card {
    height: 50px; /* Adjust the height as needed */
    margin-bottom: 5px; /* Add margin to separate cards */
    display: flex; /* Use flexbox */
    align-items: center; /* Center items vertically */
}
</style>
