<template>
    <v-btn v-if="canLeaveGroup"> Leave group </v-btn>
    <v-btn v-else-if="canJoinGroup"> Join group</v-btn>
</template>

<script setup lang="ts">
import Group from "../../models/Group.js";
import Project from "../../models/Project.js";
import User from "../../models/User.js";
import {computed, toRefs} from "vue";

const props = defineProps<{
    group: Group;
    project: Project;
    user: User;
    amountOfMembers: number;
}>();

const { group, project, user, amountOfMembers} = toRefs(props);

const canJoinGroup = computed(() => {
    return !isUserInGroup.value && amountOfMembers.value < project.value.capacity && !isTeacher.value;
});

const canLeaveGroup = computed(() => {
    return project.value.capacity !== 1 && isUserInGroup.value && !isTeacher.value;
});

const isTeacher = computed(() => user.value.is_teacher || false);

const isUserInGroup = computed(() => {
    if (!user.value || !group.value) return false;
    return group.value.members.some(member => member.uid === user.value.uid);
});

//const leaveGroup =

//const joinGroup =

</script>

<style scoped>

</style>
