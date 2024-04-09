<template>
  <h1>Projects</h1>
</template>

<script setup lang="ts">

import type Project from "@/models/Project";

defineProps<{
  projects: Project[] | undefined;
}>();

</script>

<style scoped>

</style>
