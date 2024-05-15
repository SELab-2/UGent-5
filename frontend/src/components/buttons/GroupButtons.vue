<template>
    <v-btn
        v-if="canLeaveGroup"
        @click="() => leaveGroup({ groupId: group.id, projectId: project.id })"
    >
        {{ $t("group.leave_group") }}
    </v-btn>
    <v-btn
        v-else-if="canJoinGroup"
        @click="() => joinGroup({ groupId: group.id, projectId: project.id })"
    >
        {{ $t("group.join_group") }}
    </v-btn>
    <v-btn
        v-if="isTeacher"
        @click="
            () =>
                removeGroup({
                    groupId: group.id,
                    projectId: project.id,
                })
        "
    >
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
    useDeleteGroupMutation,
    useUserGroupsQuery,
} from "@/queries/Group";

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

const { mutateAsync: removeGroup } = useDeleteGroupMutation();
</script>

<style scoped></style>
