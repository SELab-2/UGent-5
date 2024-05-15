<template>
    <v-card class="groupcard" variant="flat">
        <v-row>
            <v-col cols="8">
                <StudentsDialog :students="group.members" :title="group.team_name"/>
                <v-btn v-if="isTeacher" variant="flat" @click="toGroupPage">
                    {{ $t("group.to_grouppage") }}
                </v-btn>
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
                />
            </v-col>
        </v-row>
    </v-card>
</template>

<script setup lang="ts">
import {computed, ref, toRefs} from "vue";
import type Project from "@/models/Project";
import type Group from "@/models/Group";
import type User from "@/models/User";
import GroupButtons from "@/components/buttons/GroupButtons.vue";
import StudentsDialog from "@/components/StudentsDialog.vue";
import router from "@/router";

const props = defineProps<{
    group: Group;
    project: Project;
    user: User;
}>();

const { group, project, user } = toRefs(props);

const amountOfMembers = computed(() => {
    return group.value.members.length;
});

const isTeacher = computed(() => user.value.is_teacher || false);

const toGroupPage = async () => {
    router.push(`/groups/${group.value.id}`);
};

</script>

<style scoped>
.groupcard {
    margin: 5px 0 5px 0;
    height: 50px;
    background-color: rgb(var(--v-theme-secondary));
}

.v-row {
    display: flex;
    align-items: center;
}

.v-btn {
    text-decoration: underline;
    background-color: rgb(var(--v-theme-secondary));
    padding: 2px;
}
</style>
