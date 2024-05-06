<template>
    <v-container>
        <v-card color="white" class="infostyling">
            <v-card-title>{{ project.name }}</v-card-title>
            <v-card-item>
                <v-chip label color="primary" class="ma-2" prepend-icon="mdi-calendar">
                    {{ $d(project.deadline, "long") }}
                </v-chip>
                <v-chip label color="primary" class="ma-2" prepend-icon="mdi-school">
                    {{ subject.name }}
                </v-chip>
                <v-chip label color="primary" class="ma-2" prepend-icon="mdi-account-group">
                    {{ $t("project.capacity_group") + project.capacity }}
                </v-chip>
                <v-chip
                    v-for="instructor in instructors"
                    :key="instructor?.uid"
                    label
                    color="primary"
                    class="ma-2"
                    prepend-icon="mdi-account"
                >
                    {{ instructor?.given_name }}
                </v-chip>
            </v-card-item>
            <v-card-item>
                <v-card-title>
                    {{ $t("project.assignment") }}
                </v-card-title>
                <div v-html="renderQuillContent(project.description)"></div>
            </v-card-item>
        </v-card>
        <SubmitInfo class="submitInfo" v-if="group" :project="project" :group="group" />
    </v-container>
</template>

<script setup lang="ts">
import type Project from "@/models/Project";
import type Group from "@/models/Group";
import SubmitInfo from "@/components/project/submit/SubmitInfo.vue";
import { toRefs } from "vue";
import { Quill } from "@vueup/vue-quill";
import type User from "@/models/User";
import type Subject from "@/models/Subject";

const props = defineProps<{
    project: Project;
    group: Group | null;
    instructors: User[];
    subject: Subject;
}>();

const { project, group, instructors, subject } = toRefs(props);

const renderQuillContent = (content: string) => {
    const quill = new Quill(document.createElement("div"));
    quill.root.innerHTML = content;
    return quill.root.innerHTML;
};
</script>

<style scoped>
.submitInfo {
    padding: 10px;
    margin-top: 20px;
}
</style>
