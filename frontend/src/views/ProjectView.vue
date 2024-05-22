<template>
    <v-container>
        <h1 v-if="isDataLoading || isSubjectLoading" class="welcome">
            {{ $t("default.loading.loading_page") }}
        </h1>
        <h1 v-else-if="isDataError" class="welcome">{{ $t("project.not_found2") }}</h1>
        <div v-else class="projectInfo">
            <v-row>
                <v-col class="col-sm-12 col-md-6 col-lg-8">
                    <ProjectInfo
                        :project="project!"
                        :group="group!"
                        :instructors="instructors!"
                        :subject="subject!"
                        :user="user!"
                    />
                    <v-btn
                        v-if="isTeacher"
                        :to="`/project/${project.id}/submissions`"
                        class="allsubmissions"
                        variant="flat"
                    >
                        {{ $t("project.submissions_list_teacher") }}
                    </v-btn>
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
import { useProjectGroupQuery } from "@/queries/Group";
import { useSubjectInstructorsQuery, useSubjectQuery } from "@/queries/Subject";
import { useCurrentUserQuery } from "@/queries/User";
import ProjectSideBar from "@/components/project/ProjectSideBar.vue";

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
    data: group,
    isLoading: isGroupLoading,
    isError: isGroupError,
} = useProjectGroupQuery(projectId);

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

const { data: user, isLoading: isUserLoading, isError: isUserError } = useCurrentUserQuery();

const isDataLoading = computed(
    () =>
        isProjectLoading.value ||
        isGroupLoading.value ||
        isInstructorsLoading.value ||
        isSubjectLoading.value ||
        isUserLoading.value
);

const isDataError = computed(
    () =>
        isProjectError.value ||
        isGroupError.value ||
        isInstructorsError.value ||
        isSubjectError.value ||
        isUserError.value
);

const isTeacher = computed(
    () =>
        user.value.is_teacher ||
        user.value.is_admin ||
        instructors.value?.some((element) => element.uid == user.value.uid)
);
</script>

<style scoped>
.button-container {
    margin-top: 20px;
    min-width: 200px;
}

.allsubmissions {
    margin: 15px;
    background-color: rgb(var(--v-theme-primary));
    color: rgb(var(--v-theme-navtext));
}
</style>
