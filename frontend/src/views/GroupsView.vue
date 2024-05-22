<template>
    <v-container>
        <h1 v-if="isDataLoading" class="welcome">{{ $t("default.loading.loading_page") }}</h1>
        <h1 v-else-if="isDataError" class="welcome">{{ $t("group.error") }}</h1>
        <v-row v-else class="projectinfo">
            <v-col class="col-sm-12 col-md-6">
                <h2>{{ "Project: " + project!.name }}</h2>
                <StudentsDialog :students="allStudents" :title="$t('group.all_students')" />
                <v-divider class="border-opacity-50"></v-divider>
                <div v-if="groups.length > 0">
                    <v-row>
                        <v-col cols="7">{{ $t("group.groups") }}</v-col>
                        <v-col cols="2">{{ $t("group.members") }}</v-col>
                        <v-col cols="3">{{ $t("group.actions") }}</v-col>
                    </v-row>
                    <GroupCard
                        v-for="group in groups"
                        :key="group.id"
                        :project="project!"
                        :group="group"
                        :user="user!"
                        :isTeacher="isTeacher!"
                        class="group-card"
                    />
                </div>
                <div v-else>
                    <v-row>
                        <v-col cols="8"> {{ $t("group.not_found2") }}</v-col>
                    </v-row>
                </div>
                <v-btn v-if="isTeacher" @click="createGroup" variant="flat">{{
                    $t("group.create_group")
                }}</v-btn>
            </v-col>
            <v-col cols="2" class="buttoncontainer">
                <BackButton
                    title="project.to_project"
                    :destination="`/project/${projectId}`"
                    class="backbutton"
                />
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { useCreateGroupsMutation, useProjectGroupsQuery } from "@/queries/Group";
import { computed, toRefs } from "vue";
import { useProjectQuery } from "@/queries/Project";
import GroupCard from "@/components/groups/GroupCard.vue";
import { useCurrentUserQuery } from "@/queries/User";
import { type GroupForm } from "@/models/Group";
import { useSubjectInstructorsQuery, useSubjectStudentsQuery } from "@/queries/Subject";
import StudentsDialog from "@/components/groups/StudentsDialog.vue";
import BackButton from "@/components/buttons/BackButton.vue";

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

const { data: user, isLoading: isUserLoading, isError: isUserError } = useCurrentUserQuery();

const {
    data: allStudents,
    isLoading: isUsersLoading,
    isError: isUsersError,
} = useSubjectStudentsQuery(computed(() => project.value?.subject_id));

const {
    data: instructors,
    isLoading: isLoadingInstructors,
    isError: isErrorInstructors,
} = useSubjectInstructorsQuery(computed(() => project.value?.subject_id));

const isDataLoading = computed(
    () =>
        isProjectLoading.value ||
        isGroupLoading.value ||
        isUserLoading.value ||
        isUsersLoading.value ||
        isLoadingInstructors.value
);

const isDataError = computed(
    () =>
        isProjectError.value ||
        isGroupError.value ||
        isUserError.value ||
        isUsersError.value ||
        isErrorInstructors.value
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

const { mutateAsync: createGroupMutate } = useCreateGroupsMutation();

async function createGroup() {
    const groupForm: GroupForm = {
        project_id: project.value!.id,
        score: 0,
    };

    try {
        await createGroupMutate({ projectId: projectId.value, groups: [groupForm] });
    } catch (error) {
        alert("Could not create group. Please try again.");
    }
}
</script>

<style scoped>
.v-container {
    padding: 25px;
    position: relative;
}

.group-card {
    height: 50px; /* Adjust the height as needed */
    margin-bottom: 5px; /* Add margin to separate cards */
    display: flex; /* Use flexbox */
    align-items: center; /* Center items vertically */
}

.v-divider {
    margin-bottom: 15px;
    margin-top: 15px;
}

.backbutton {
    margin: 25px;
}

.buttoncontainer {
    min-width: 200px;
}
@media (max-width: 900px) {
    .backbutton {
        margin-right: 0;
    }

    .buttoncontainer {
        z-index: 10;
        position: absolute;
        right: 20px;
        top: 10px;
    }

    .projectinfo {
        position: relative;
    }
}
</style>
