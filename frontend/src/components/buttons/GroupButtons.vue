<template>
    <v-btn v-if="canLeaveGroup" @click="leaveGroupAndRedirect" variant="flat">
        {{ $t("group.leave_group") }}
    </v-btn>
    <v-btn v-else-if="canJoinGroup" @click="joinGroupAndRedirect" variant="flat">
        {{ $t("group.join_group") }}
    </v-btn>
    <v-btn v-if="isTeacher" @click="() => removeGroup({ groupId: group.id })" variant="flat">
        {{ $t("group.remove_group") }}
    </v-btn>
</template>

<script setup lang="ts">
import type Group from "@/models/Group.js";
import type Project from "@/models/Project.js";
import type User from "@/models/User.js";
import { computed, toRefs } from "vue";
import {
    useJoinGroupUserMutation,
    useLeaveGroupUserMutation,
    useRemoveGroupMutation,
    useUserGroupsQuery,
} from "@/queries/Group";
import router from "@/router";

const props = defineProps<{
    group: Group;
    project: Project;
    user: User;
    amountOfMembers: number;
}>();

const { group, project, user, amountOfMembers } = toRefs(props);

const canJoinGroup = computed(() => {
    return (
        !isUserInGroup.value &&
        amountOfMembers.value < project.value.capacity &&
        !isTeacher.value &&
        !isUserInAnotherGroup.value
    );
});

const canLeaveGroup = computed(() => {
    return project.value.capacity !== 1 && isUserInGroup.value && !isTeacher.value;
});

const isTeacher = computed(() => user.value.is_teacher || false);

const isUserInGroup = computed(() => {
    return group.value.members.some((member) => member.uid === user.value.uid);
});

const { data: groups } = useUserGroupsQuery();

const isUserInAnotherGroup = computed(() => {
    if (!groups.value) return true;
    return groups.value.some((groupelem) => {
        return groupelem.project_id === project.value.id && groupelem.id !== group.value.id;
    });
});

const { mutateAsync: leaveGroup } = useLeaveGroupUserMutation();

const { mutateAsync: joinGroup } = useJoinGroupUserMutation();

const { mutateAsync: removeGroup } = useRemoveGroupMutation();

const joinGroupAndRedirect = async () => {
    await joinGroup({ groupId: group.value.id });
    router.push(`/groups/${group.value.id}`);
};

const leaveGroupAndRedirect = async () => {
    await leaveGroup({ groupId: group.value.id });
    router.push(`/project/${project.value.id}/groups`);
};
</script>

<style scoped>
.v-btn {
    text-decoration: underline;
    background-color: rgb(var(--v-theme-secondary));
    padding: 2px;
}

</style>
