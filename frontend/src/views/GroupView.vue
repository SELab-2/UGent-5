<template>
    <v-container>
        <h1 v-if="isLoading" class="welcome">{{ $t("default.loading.loading_page") }}</h1>
        <h1 v-else-if="isError" class="welcome">
            {{ $t("group.not_found") }}
        </h1>
        <div v-else>
            <h1>{{ group!.team_name }}</h1>
            <h2>{{ "Project: " + project!.name }}</h2>
            <v-card>
                <v-card-item :title="$t('group.members')">
                    <div v-if="group!.members.length">
                        <v-row
                            v-for="(member, index) in group!.members"
                            :key="index"
                            align="center"
                        >
                            <v-col>{{ member.given_name }}</v-col>
                            <v-col>
                                <v-btn
                                    v-if="isTeacher"
                                    prepend-icon="mdi-close"
                                    color="red"
                                    @click="
                                        () => removeStudent({ groupId: group!.id, uid: member.uid })
                                    "
                                >
                                    {{ $t("group.remove") }}</v-btn
                                >
                            </v-col>
                        </v-row>
                    </div>
                    <div v-else>
                        {{ $t("group.no_members_found") }}
                    </div>
                </v-card-item>
                <v-card-actions>
                    <GroupButtons
                        :amountOfMembers="amountOfMembers"
                        :group="group!"
                        :project="project!"
                        :user="user!"
                    />
                </v-card-actions>
            </v-card>
        </div>
    </v-container>
</template>

<script setup lang="ts">
import { toRefs, computed } from "vue";
import { useGroupQuery, useRemoveUserFromGroupMutation } from "@/queries/Group";
import { useProjectQuery } from "@/queries/Project";
import { useUserQuery } from "@/queries/User";
import GroupButtons from "@/components/buttons/GroupButtons.vue";

const props = defineProps<{
    groupId: number;
}>();

const { groupId } = toRefs(props);

const { data: group, isLoading: isLoadingGroup, isError: isErrorGroup } = useGroupQuery(groupId);

const {
    data: project,
    isLoading: isLoadingProject,
    isError: isErrorProject,
} = useProjectQuery(computed(() => group.value?.project_id));

const { data: user, isLoading: isLoadingUser, isError: isErrorUser } = useUserQuery(null);

const isLoading = computed(
    () => isLoadingGroup.value || isLoadingProject.value || isLoadingUser.value
);
const isError = computed(() => isErrorGroup.value || isErrorProject.value || isErrorUser.value);

const isTeacher = computed(() => user.value?.is_teacher || false);

const amountOfMembers = computed(() => {
    if (!group.value) return 0;
    return group.value.members.length;
});

const { mutateAsync: removeStudent } = useRemoveUserFromGroupMutation();
</script>

<style scoped></style>
