<template>
    <v-container>
        <v-card class="projectCard" variant="flat">
            <v-card-title>{{ project.name }}</v-card-title>
            <v-card-item>
                <v-chip label class="ma-2" prepend-icon="mdi-calendar">
                    {{ $d(project.deadline, "long") }}
                </v-chip>
                <v-chip label class="ma-2" prepend-icon="mdi-school">
                    {{ subject.name }}
                </v-chip>
                <v-chip label class="ma-2" prepend-icon="mdi-account-group">
                    {{ $t("project.capacity_group") + project.capacity }}
                </v-chip>
                <v-chip
                    v-for="instructor in instructors"
                    :key="instructor?.uid"
                    label
                    class="ma-2"
                    prepend-icon="mdi-account"
                >
                    {{ getAbbreviatedName(instructor) }}
                </v-chip>
            </v-card-item>
            <v-card-item>
                <v-card-title>
                    {{ $t("project.assignment") }}
                </v-card-title>
                <div v-html="renderQuillContent(project.description)"></div>
            </v-card-item>
            <v-card-actions>
                <v-btn v-if="isTeacher" :to="`/project/${project.id}/submissions`">
                    {{ $t("project.submissions_list_teacher") }}
                </v-btn>
            </v-card-actions>
        </v-card>
        <SubmitInfo class="submitInfo" v-if="group" :project="project" :group="group" />
    </v-container>
</template>

<script setup lang="ts">
import type Project from "@/models/Project";
import type Group from "@/models/Group";
import SubmitInfo from "@/components/submission/SubmitInfo.vue";
import { toRefs, computed } from "vue";
import { Quill } from "@vueup/vue-quill";
import type User from "@/models/User";
import type Subject from "@/models/Subject";

const props = defineProps<{
    project: Project;
    group: Group | null;
    instructors: User[];
    user: User;
    subject: Subject;
}>();

const { project, group, instructors, subject, user } = toRefs(props);

const isTeacher = computed(
    () => user.value.is_admin || instructors.value?.some((element) => element.uid == user.value.uid)
);

const renderQuillContent = (content: string) => {
    const quill = new Quill(document.createElement("div"));
    quill.root.innerHTML = content;
    return quill.root.innerHTML;
};

const getAbbreviatedName = (instructor: User) => {
    if (instructor) {
        return instructor.given_name.charAt(0).toUpperCase() + ". " + instructor.surname;
    }
    return "";
};
</script>

<style scoped>
.submitInfo {
    padding: 10px;
    margin-top: 20px;
}

.projectCard {
    background-color: rgb(var(--v-theme-secondary));
}
</style>
