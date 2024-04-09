<template>
    <v-card
        class="project-card"
        variant="text"
    >
        <v-card-title>
            <span class="title">{{project?.name}}</span>
        </v-card-title>
        <v-card-subtitle>
            <v-row>
                <v-col>
                    <v-icon>mdi-clock</v-icon>
                </v-col>
                <v-col>
                    <span>{{project?.deadline}}</span>
                </v-col>
            </v-row>
        </v-card-subtitle>
    </v-card>

</template>

<script setup lang="ts">

import type Project from "@/models/Project";

defineProps<{
    project: Project;
}>();

</script>

<style scoped>

.project-card {
    background-color: var(--color-secondary);
}

</style>
