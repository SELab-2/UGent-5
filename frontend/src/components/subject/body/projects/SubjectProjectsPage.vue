<template>
  <v-row>
      <v-col cols="5">
          <SubjectProjectsList
                :projects="projects"
                :selected-tab="selectedTab"
                @tab-changed="updateSelectedTab"
          ></SubjectProjectsList>
      </v-col>
      <v-col cols="7">
          <SubjectProjectPage :selected-tab="selectedTab"></SubjectProjectPage>
      </v-col>
  </v-row>
</template>

<script setup lang="ts">
import SubjectProjectsList from "@/components/subject/body/projects/SubjectProjectsList.vue";

import type Project from "@/models/Project";
import {ref} from "vue";
import SubjectProjectPage from "@/components/subject/body/projects/SubjectProjectPage.vue";

defineProps<{
  projects: Project[] | undefined;
}>();

const selectedTab = ref(0);

const updateSelectedTab = (tabIndex) => {
    selectedTab.value = tabIndex;
};

</script>

<style scoped>

</style>
