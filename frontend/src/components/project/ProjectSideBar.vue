<template>
    <router-link :to="`/subjects/${project!.subject_id}`">
        <v-btn class="group-button" prepend-icon="mdi-arrow-left">
            {{ $t("default.to") + subject!.name }}
        </v-btn>
    </router-link>
    <router-link v-if="group && !isSoloProject && !isTeacher" :to="`/groups/${group!.id}`">
        <v-btn class="group-button" prepend-icon="mdi-account-group">
            {{ $t("project.group", { number: group!.id }) }}
        </v-btn>
    </router-link>
    <router-link v-else-if="!isSoloProject && !isTeacher" :to="`/project/${project!.id}/groups`">
        <v-btn class="group-button" prepend-icon="mdi-account-group">
            {{ $t("project.group_button") }}
        </v-btn>
    </router-link>
    <NeedHelpButton
        v-if="!isTeacher && subject!.email"
        class="group-button"
        :email="subject!.email"
    ></NeedHelpButton>
    <router-link v-if="isTeacher" :to="`/projects/${project!.id}/edit`">
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
import { useUserQuery } from "@/queries/User";

const props = defineProps<{
    project: Project;
    group: Group | null;
    subject: Subject;
    instructors: User[];
}>();

const { project, group, subject, instructors } = toRefs(props);

const { data: user } = useUserQuery(null);

const isTeacher = computed(() => {
    if (!user.value || !instructors.value) {
        return false;
    }
    return instructors.value.some((instructor) => instructor.uid === user.value.uid);
});

const isSoloProject = computed(() => project.value.capacity === 1);
</script>

<style scoped>
.group-button {
    margin-bottom: 5px;
    min-width: auto;
}
</style>
