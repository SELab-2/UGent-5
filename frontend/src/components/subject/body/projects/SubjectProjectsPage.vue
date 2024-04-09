<template>
  <v-row>
      <v-col cols="§">
          <SubjectProjectsList
                :projects="projects"
          ></SubjectProjectsList>
      </v-col>
      <v-col cols="6">

      </v-col>
  </v-row>
</template>

<script setup lang="ts">
import SubjectProjectsList from "@/components/subject/body/projects/SubjectProjectsList.vue";

import type Project from "@/models/Project";

defineProps<{
  projects: Project[] | undefined;
}>();

</script>

<style scoped>

</style>
