<template>
    <router-link :to="`/subjects/${project!.subject_id}`">
        <v-btn class="group-button" prepend-icon="mdi-arrow-left">
            {{ $t("project.to_subject") }}
        </v-btn>
    </router-link>
    <router-link v-if="group && !isSoloProject && !isTeacher" :to="`/submissions/${group!.id}`">
        <v-btn class="group-button" prepend-icon="mdi-account-group">
            {{ $t("project.group", { number: group!.num }) }}
        </v-btn>
    </router-link>
    <router-link v-else-if="!isSoloProject && !isTeacher" :to="`/project/${project!.id}/groups`">
        <v-btn class="group-button" prepend-icon="mdi-account-group">
            {{ $t("project.group_button") }}
        </v-btn>
    </router-link>
    <router-link v-else-if="isTeacher && !isSoloProject" :to="`/project/${project!.id}/groups`">
        <v-btn class="group-button" prepend-icon="mdi-account-group">
            {{ $t("project.to_groups") }}
        </v-btn>
    </router-link>
    <NeedHelpButton
        v-if="!isTeacher && subject!.email"
        class="group-button"
        :email="subject!.email"
    ></NeedHelpButton>
    <router-link v-if="isTeacher" :to="`/project/${project!.id}/edit`">
        <v-btn class="group-button" prepend-icon="mdi-pencil">
            {{ $t("project.edit") }}
        </v-btn>
    </router-link>
</template>

<script setup lang="ts">
import type Project from "@/models/Project";
import type Group from "@/models/Group";
import type Subject from "@/models/Subject";
import NeedHelpButton from "@/components/buttons/NeedHelpButton.vue";
import { computed, toRefs } from "vue";
import type User from "@/models/User";
import { useCurrentUserQuery } from "@/queries/User";

const props = defineProps<{
    project: Project;
    group: Group | null;
    subject: Subject;
    instructors: User[];
}>();

const { project, group, subject, instructors } = toRefs(props);

const { data: user } = useCurrentUserQuery();

const isTeacher = computed(() => {
    if (!user.value || !instructors.value) {
        return false;
    }
    return (
        user.value.is_admin ||
        instructors.value.some((instructor) => instructor.uid === user.value.uid)
    );
});

const isSoloProject = computed(() => project.value.capacity === 1);
</script>

<style scoped>
.group-button {
    margin-bottom: 5px;
    width: 200px;
    background-color: rgb(var(--v-theme-primary));
    color: rgb(var(--v-theme-navtext));
}
</style>
