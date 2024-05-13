<template>
    <v-container>
        <h1 v-if="isDataLoading" class="welcome">{{ $t("default.loading.loading_page") }}</h1>
        <h1 v-else-if="isDataError" class="welcome">{{ $t("project.not_found2") }}</h1>
        <div v-else class="projectInfo">
            <v-row>
                <v-col cols="10">
                    <ProjectInfo
                        :project="project!"
                        :group="group!"
                        :instructors="instructors!"
                        :subject="subject!"
                    />
                </v-col>
                <v-col cols="2" class="button-container">
                    <ProjectSideBar
                        :project="project!"
                        :group="group!"
                        :subject="subject!"
                        :instructors="instructors!"
                    />
                </v-col>
            </v-row>
        </div>
    </v-container>
</template>

<script setup lang="ts">
import ProjectInfo from "@/components/project/ProjectInfo.vue";
import { useProjectQuery } from "@/queries/Project";
import { computed, toRefs } from "vue";
import { useProjectGroupsQuery } from "@/queries/Group";
import { useSubjectInstructorsQuery, useSubjectQuery } from "@/queries/Subject";
import ProjectSideBar from "@/components/project/ProjectSideBar.vue";
import { useCurrentUserQuery } from "@/queries/User";

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
    isLoading: isGroupsLoading,
    isError: isGroupsError,
} = useProjectGroupsQuery(projectId);

const { data: user } = useCurrentUserQuery();

const group = computed(
    () =>
        groups.value?.filter((group) =>
            group.members.some((member) => member.uid === user.value?.uid)
        )[0]
);

const {
    data: subject,
    isLoading: isSubjectLoading,
    isError: isSubjectError,
} = useSubjectQuery(computed(() => project.value?.subject_id));

const {
    data: instructors,
    isLoading: isInstructorsLoading,
    isError: isInstructorsError,
} = useSubjectInstructorsQuery(computed(() => project.value?.subject_id));

const isDataLoading = computed(
    () =>
        isProjectLoading.value ||
        isGroupsLoading.value ||
        isInstructorsLoading.value ||
        isSubjectLoading.value
);

const isDataError = computed(
    () =>
        isProjectError.value ||
        isGroupsError.value ||
        isInstructorsError.value ||
        isSubjectError.value
);
</script>

<style scoped>
.button-container {
    margin-top: 20px;
}
</style>
