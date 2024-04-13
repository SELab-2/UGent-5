<template>
    <v-card color="white">
        <v-card-title>{{project?.name}}</v-card-title>
        <v-container>
            <v-row>
                {{project?.deadline}}
                {{subject?.name}}
            </v-row>
        </v-container>
        <v-card-item>
            <v-card-title>
                assignment:
            </v-card-title>
            <v-card-text>

            </v-card-text>
        </v-card-item>
    </v-card>
</template>

<script setup lang="ts">
import type Project from "@/models/Project";
import {useSubjectQuery} from "@/queries/Subject";
import {computed} from "vue";
import { toRefs } from "vue";

const props = defineProps<{
    project: Project;
}>();

const { project } = toRefs(props);

const { data: subject, isLoading: isSubjectLoading } = useSubjectQuery(
    computed(() => project.value?.subject_id)
);

</script>

<style scoped>

</style>
