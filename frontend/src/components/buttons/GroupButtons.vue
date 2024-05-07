<template>
    <v-btn v-if="canLeaveGroup" @click="leaveGroupMutation"> {{ $t("group.leave_group") }} </v-btn>
    <v-btn v-else-if="canJoinGroup" @click="joinGroupMutation"> {{ $t("group.join_group") }} </v-btn>
    <v-btn v-if="isTeacher" @click="removeGroupMutation"> {{ $t("group.remove_group")}}</v-btn>
</template>

<script setup lang="ts">
import Group from "../../models/Group.js";
import Project from "../../models/Project.js";
import User from "../../models/User.js";
import {computed, toRefs} from "vue";
import {
    useJoinGroupUserMutation,
    useLeaveGroupUserMutation,
    useRemoveGroupMutation
} from "@/queries/Group";

const props = defineProps<{
    group: Group;
    project: Project;
    user: User;
    amountOfMembers: number;
    groups: Group[] | null; //TODO: remove groups and go with user_groups instead
}>();

const { group, project, user, amountOfMembers, groups} = toRefs(props);

const canJoinGroup = computed(() => {
    return !isUserInGroup.value && amountOfMembers.value < project.value.capacity && !isTeacher.value && !isUserInAnotherGroup.value;
});

const canLeaveGroup = computed(() => {
    return project.value.capacity !== 1 && isUserInGroup.value && !isTeacher.value;
});

const isTeacher = computed(() => user.value.is_teacher || false);

const isUserInGroup = computed(() => {
    return group.value.members.some(member => member.uid === user.value.uid);
});

const isUserInAnotherGroup = computed(() => {
    if(!groups.value) return false;
    return groups.value?.some(groupelem => groupelem.members.some(member => (member.uid === user.value.uid && groupelem.id !== group.value.id)));
});


const leaveGroup = useLeaveGroupUserMutation();

const leaveGroupMutation = async () => {
    try {
        await leaveGroup.mutate({ groupId: group.value.id });
    } catch (error) {
        console.error("Error leaving group:", error);
        alert("Could not leave group. Please try again.");
    }
};


const joinGroup = useJoinGroupUserMutation();

const joinGroupMutation = async () => {
    try {
        await joinGroup.mutate({ groupId: group.value.id });
    } catch (error) {
        console.error("Error joining group:", error);
        alert("Could not join group. Please try again.");
    }
};


const { mutateAsync: removeGroup } = useRemoveGroupMutation();

const removeGroupMutation = async () => {
    try {
        await removeGroup.mutate({ groupId: group.value.id });
    } catch (error) {
        console.error("Error removing group:", error);
        alert("Could not remove group. Please try again.");
    }
};

</script>

<style scoped>

</style>
