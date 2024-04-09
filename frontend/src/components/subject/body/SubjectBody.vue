<template>
    <SubjectPageTab :projects="projects"></SubjectPageTab>
</template>

<script setup lang="ts">
import SubjectPageTab from "@/components/subject/body/SubjectPageTab.vue";
import type Project from "@/models/Project";

defineProps<{
    projects: Project[] | undefined;
}>();

</script>

<style scoped>

</style>
