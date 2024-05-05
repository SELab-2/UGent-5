<template>
    <v-container>
        <h1 v-if="isLoading" class="welcome">{{ $t("default.loading.loading_page") }}</h1>
        <h1 v-else-if="isError" class="welcome">
            {{ $t("group.not_found") }}
        </h1>
        <div v-else>
            <v-card>
                <v-card-title> {{group.team_name}}</v-card-title>
                <v-card-subtitle> {{"Project: "+ project.name}} </v-card-subtitle>
                <v-card-item>
                    <p>Members:</p>
                    <div v-for="(member, index) in group.members" :key="index">
                        {{ member.given_name }}
                    </div>
                </v-card-item>
                <v-card-actions v-if="canLeaveGroup">
                    <v-btn> Leave group </v-btn>
                </v-card-actions>
            </v-card>
        </div>
    </v-container>
</template>

<script setup lang="ts">

import {toRefs, computed} from "vue";
import {useGroupQuery} from "@/queries/Group";
import {useProjectQuery} from "@/queries/Project";
import {useUserQuery} from "@/queries/User";

const props = defineProps<{
    groupId: number;
}>();

const { groupId } = toRefs(props);

const {
    data: group,
    isLoading: isLoadingGroup,
    isError: isErrorGroup
} = useGroupQuery(groupId);

const {
    data: project,
    isLoading: isLoadingProject,
    isError: isErrorProject
} = useProjectQuery(computed(() => group.value?.project_id))

const { data: user, isLoading: isLoadingUser,  isError: isErrorUser} = useUserQuery(null);

const isLoading = computed(() => isLoadingGroup.value || isLoadingProject.value || isLoadingUser.value);
const isError = computed(() => isErrorGroup.value || isErrorProject.value || isErrorUser.value);

const amountOfMembers = computed(() => {
    if (!group.value) return 0; // Return 0 if group data is not available
    return group.value.members.length;
});

const isUserInGroup = computed(() => {
    if (!user.value || !group.value) return false; // Check if user and group data are available
    return group.value.members.some(member => member.uid === user.value.uid);
});

const canJoinGroup = computed(() => {
    const totalMembers = group.value?.members.length || 0;

    return !isUserInGroup.value && totalMembers < project.value.capacity;
});

const canLeaveGroup = computed(() => {
    if (!user.value || !group.value) return false;
    return project.value.capacity !== 1 && isUserInGroup;
});
</script>

<style scoped></style>
