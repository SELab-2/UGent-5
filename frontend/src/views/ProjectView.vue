<template>
    <v-container>
        <h1 v-if="isDataLoading" class="welcome">{{ $t("default.loading.loading_page") }}</h1>
        <h1 v-else-if="isDataError" class="welcome">{{ $t("default.error") }}</h1>
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
                    <router-link :to="`/subjects/${project!.subject_id}`">
                        <v-btn class="group-button" prepend-icon="mdi-arrow-left">
                            {{ $t("project.return_course") }}
                        </v-btn>
                    </router-link>
                    <router-link
                        v-if="group && !isSoloProject && !isTeacher"
                        :to="`/groups/${group!.id}`"
                    >
                        <v-btn class="group-button" prepend-icon="mdi-account-group">
                            {{ $t("project.group", { number: group!.id }) }}
                        </v-btn>
                    </router-link>
                    <router-link
                        v-else-if="!isSoloProject && !isTeacher"
                        :to="`/projects/${projectId}/groups`"
                    >
                        <v-btn class="group-button" prepend-icon="mdi-account-group">
                            {{ $t("project.group_button") }}
                        </v-btn>
                    </router-link>
                    <NeedHelpButton
                        v-if="!isTeacher"
                        class="group-button"
                        :email="subject!.email"
                    ></NeedHelpButton>
                    <router-link v-if="isTeacher" :to="`/projects/${projectId}/edit`">
                        <v-btn class="group-button" prepend-icon="mdi-pencil">
                            {{ $t("project.edit") }}
                        </v-btn>
                    </router-link>
                </v-col>
            </v-row>
        </div>
    </v-container>
</template>

<script setup lang="ts">
import ProjectInfo from "@/components/project/ProjectInfo.vue";
import { useProjectQuery } from "@/queries/Project";
import { computed, toRefs } from "vue";
import NeedHelpButton from "@/components/buttons/NeedHelpButton.vue";
import { useUserGroupQuery } from "@/queries/Group";
import { useSubjectInstructorsQuery, useSubjectQuery } from "@/queries/Subject";
import { useUserQuery } from "@/queries/User";

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
} = useUserGroupQuery(projectId);

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

const { data: user } = useUserQuery(null);

const isTeacher = computed(() => {
    if (!user.value || !instructors.value) {
        return false;
    }
    return instructors.value.some((instructor) => instructor.uid === user.value.uid);
});

const isDataLoading = computed(
    () =>
        isProjectLoading.value ||
        isGroupLoading.value ||
        isInstructorsLoading.value ||
        isSubjectLoading.value
);

const isDataError = computed(
    () =>
        isProjectError.value ||
        isGroupError.value ||
        isInstructorsError.value ||
        isSubjectError.value
);

const isSoloProject = computed(() => project.value.capacity === 1);
</script>

<style scoped>
.button-container {
    margin-top: 20px;
}

.group-button {
    margin-bottom: 5px;
    min-width: auto;
}
</style>
