<template>
    <v-card variant="text" class="page-card">
        <v-card-title>
            <SubjectPageTab :projects="projects"></SubjectPageTab>
        </v-card-title>
    </v-card>
</template>

<script setup lang="ts">

import SubjectPageTab from "@/components/subject/body/SubjectPageTab.vue";
import type Project from "@/models/Project";

defineProps<{
    projects: Project[] | undefined;
}>();
</script>

<style scoped>
.page-card {
    border-radius: 20px;
    background-color: white;
    height: 400px;
}
</style>
