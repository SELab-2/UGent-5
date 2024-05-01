<template>
    <v-card color="white" class="infostyling">
        <v-card-title>{{ project.name }}</v-card-title>
        <v-container>
            <v-row>
                <v-chip label color="primary" class="ma-2" prepend-icon="mdi-calendar">
                    {{ $d(project.deadline, "long") }}
                </v-chip>
                <v-chip label color="primary" class="ma-2" prepend-icon="mdi-school">
                    {{ subject?.name }}
                </v-chip>
                <v-chip
                    label
                    color="primary"
                    class="ma-2"
                    prepend-icon="mdi-account-group"
                    v-tooltip="`${$t('project.capacity_group')} ${project.capacity}`"
                >
                    {{ project.capacity }}
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
            </v-row>
        </v-container>
        <v-card-item>
            <v-card-title>
                {{ $t("project.assignment") }}
            </v-card-title>
            <div v-html="renderQuillContent(project.description)"></div>
        </v-card-item>
    </v-card>
</template>

<script setup lang="ts">
import type Project from "@/models/Project";
import { useSubjectInstructorsQuery, useSubjectQuery } from "@/queries/Subject";
import { computed } from "vue";
import { toRefs } from "vue";
import { Quill } from "@vueup/vue-quill";

const props = defineProps<{
    project: Project;
}>();

const { project } = toRefs(props);

const { data: subject } = useSubjectQuery(computed(() => project.value.subject_id));

const { data: instructors } = useSubjectInstructorsQuery(computed(() => project.value.subject_id));

const renderQuillContent = (content: string) => {
    const quill = new Quill(document.createElement("div"));
    quill.root.innerHTML = content;
    return quill.root.innerHTML;
};
</script>

<style scoped></style>
