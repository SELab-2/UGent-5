<template>
    <v-container>
        <h1 v-if="isLoading" class="welcome">{{ $t("default.loading.loading_page") }}</h1>
        <h1 v-else-if="isError" class="welcome">
            {{ $t("group.not_found") }}
        </h1>
        <v-row v-else>
            <v-col class="col-sm-12 col-md-6 col-lg-8">
                <h1>{{ $t("project.group", { number: group!.num }) }}</h1>
                <h2>{{ "Project: " + project!.name }}</h2>
                <v-card variant="flat">
                    <v-card-item :title="$t('group.members')">
                        <div v-if="group!.members.length" class="members">
                            <v-row
                                v-for="(member, index) in group!.members"
                                :key="index"
                                align="center"
                            >
                                <v-col>{{ member.given_name + " " + member.surname }}</v-col>
                                <v-col>
                                    <v-btn
                                        v-if="isTeacher"
                                        prepend-icon="mdi-close"
                                        color="red"
                                        variant="flat"
                                        @click="
                                            () =>
                                                removeStudent({
                                                    groupId: group!.id,
                                                    uid: member.uid,
                                                })
                                        "
                                    >
                                        {{ $t("group.remove") }}</v-btn
                                    >
                                </v-col>
                            </v-row>
                        </div>
                        <div v-else class="members">
                            {{ $t("group.no_members_found") }}
                        </div>
                    </v-card-item>
                    <v-card-actions>
                        <GroupButtons
                            :amountOfMembers="amountOfMembers"
                            :group="group!"
                            :project="project!"
                            :user="user!"
                            :isTeacher="isTeacher!"
                        />
                    </v-card-actions>
                </v-card>
                <v-card variant="outlined" class="submissions">
                    <SubmissionList :groupId="groupId" />
                </v-card>
            </v-col>
            <v-col cols="2" class="backbutton">
                <BackButton
                    title="project.to_project"
                    :destination="`/project/${group.project_id}`"
                />
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { toRefs, computed } from "vue";
import { useGroupQuery, useRemoveUserFromGroupMutation } from "@/queries/Group";
import { useProjectQuery } from "@/queries/Project";
import { useCurrentUserQuery } from "@/queries/User";
import GroupButtons from "@/components/buttons/GroupButtons.vue";
import SubmissionList from "@/components/submission/SubmissionList.vue";
import BackButton from "@/components/buttons/BackButton.vue";
import { useSubjectInstructorsQuery } from "@/queries/Subject";

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

const { data: user, isLoading: isLoadingUser, isError: isErrorUser } = useCurrentUserQuery();
const {
    data: instructors,
    isLoading: isLoadingInstructors,
    isError: isErrorInstructors,
} = useSubjectInstructorsQuery(computed(() => project.value?.subject_id));

const isLoading = computed(
    () =>
        isLoadingGroup.value ||
        isLoadingProject.value ||
        isLoadingUser.value ||
        isLoadingInstructors.value
);
const isError = computed(
    () =>
        isErrorGroup.value || isErrorProject.value || isErrorUser.value || isErrorInstructors.value
);

const isTeacher = computed(() => {
    if (!user.value || !instructors.value) {
        return false;
    }
    return (
        user.value.is_admin ||
        instructors.value.some((instructor) => instructor.uid === user.value.uid)
    );
});

const amountOfMembers = computed(() => {
    if (!group.value) return 0;
    return group.value.members.length;
});

const { mutateAsync: removeStudent } = useRemoveUserFromGroupMutation();
</script>

<style scoped>
.v-card {
    margin-top: 15px;
    background-color: rgb(var(--v-theme-secondary));
}

.members {
    margin-top: 15px;
}

.backbutton {
    margin-top: 25px;
}

.submissions {
    background-color: rgb(var(--v-theme-background));
}
</style>
