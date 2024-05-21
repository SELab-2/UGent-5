<template>
    <div class="tab-container">
        <v-tabs v-model="tab" align-tabs="center" grow slider-color="#3F3BE1">
            <v-tab
                height="25px"
                v-for="(item, index) in items"
                :key="index"
                :value="index"
                :class="{ 'page-tab': true, active: index === tab }"
                >{{ $t(`subject.${item}`) }}
            </v-tab>
        </v-tabs>
    </div>

    <v-window v-model="tab">
        <v-window-item value="0" key="0">
            <SubjectProjectsPage :projects="projects"></SubjectProjectsPage>
        </v-window-item>
        <v-window-item value="1" key="1">
            <SubjectGroupsPage />
        </v-window-item>
    </v-window>
</template>

<script setup lang="ts">
import SubjectProjectsPage from "@/components/subject/subjectview/body/projects/SubjectProjectsPage.vue";
import SubjectGroupsPage from "@/components/subject/subjectview/body/groups/SubjectGroupsPage.vue";

import { ref } from "vue";
import type Project from "@/models/Project";

defineProps<{
    projects: Project[];
}>();

const items = ["projects", "groups"];
const tab = ref(0);
</script>

<style scoped>


.page-tab {
    font-size: 16px;
    font-weight: 500;
    font-family: "Poppins", sans-serif;
    text-transform: capitalize;
    background-color: rgb(var(--v-theme-background));
}

.tab-container {
    border-top-right-radius: 20px;
    border-top-left-radius: 20px;
    background-color: rgb(var(--v-theme-background));
    padding-top: 16px;
    height: 30px;
    margin-bottom: 20px;
}
</style>
