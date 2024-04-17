<template>
    <v-card color="white" class="infostyling">
        <v-card-title>{{project?.name}}</v-card-title>
        <v-container>
            <v-row>
                <v-chip label color="primary" class="ma-2">
                    {{ $d(project?.deadline, "long") }}
                </v-chip>
                <v-chip label color="primary" class="ma-2">
                    {{ subject?.name }}
                </v-chip>
                <v-chip v-for="instructor in instructors" :key="instructor?.uid" label color="primary" class="ma-2">
                    {{ instructor?.given_name }}
                </v-chip>
            </v-row>
        </v-container>
        <v-card-item>
            <v-card-title>
                {{ $t("project.assignment") }}
            </v-card-title>
            <v-card-text>
                {{ project?.description }}
            </v-card-text>
        </v-card-item>
    </v-card>
</template>

<script setup lang="ts">
import type Project from "@/models/Project";
import {useSubjectInstructorsQuery, useSubjectQuery} from "@/queries/Subject";
import {computed} from "vue";
import { toRefs } from "vue";

const props = defineProps<{
    project: Project;
}>();

const { project } = toRefs(props);

const { data: subject } = useSubjectQuery(
    computed(() => project.value?.subject_id)
);

const { data: instructors} = useSubjectInstructorsQuery(
    computed( () => project.value?.subject_id)
);


</script>


<style scoped>

</style>
