<template>
    <v-card class="v-card-padding">
        <v-row>
            <v-col cols="8">
                <router-link :to="`/groups/${group.id}`">
                    {{ group.team_name }}
                </router-link>
            </v-col>
            <v-col cols="2">
                {{ amountOfMembers + "/" + project.capacity }}
            </v-col>
            <v-col cols="2">
                <GroupButtons
                    :amountOfMembers="amountOfMembers"
                    :group="group"
                    :project="project"
                    :user="user"
                    :isTeacher="isTeacher"
                />
            </v-col>
        </v-row>
    </v-card>
</template>

<script setup lang="ts">
import { computed, toRefs } from "vue";
import type Project from "@/models/Project";
import type Group from "@/models/Group";
import type User from "@/models/User";
import GroupButtons from "@/components/buttons/GroupButtons.vue";

const props = defineProps<{
    group: Group;
    project: Project;
    user: User;
    isTeacher: boolean;
}>();

const { group, project, user, isTeacher } = toRefs(props);

const amountOfMembers = computed(() => {
    return group.value.members.length;
});
</script>

<style scoped>
.v-card-padding {
    padding: 5px;
    margin-bottom: 5px;
    height: 50px;
}
</style>
