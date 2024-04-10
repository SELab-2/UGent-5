<template>
    <v-row>
        <v-col cols="5">
            <SubjectProjectsList
                :projects="filteredProjects"
                :selected-tab="selectedTab"
                @tab-changed="updateSelectedTab"
                @filter-changed="updateFilterOption"
            ></SubjectProjectsList>
        </v-col>
        <v-col cols="7">
            <v-window v-model="selectedTab" direction="vertical">
                <v-window-item v-for="(project, index) in filteredProjects" :key="index" :value="index">
                    <SubjectProjectPage
                        :selected-tab="selectedTab"
                        :project="project"
                    ></SubjectProjectPage>
                </v-window-item>
            </v-window>

        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import SubjectProjectsList from "@/components/subject/body/projects/list/SubjectProjectsList.vue";

import type Project from "@/models/Project";
import {FilterOptions} from "@/models/Project";
import {computed, ref, toRefs} from "vue";
import SubjectProjectPage from "@/components/subject/body/projects/SubjectProjectPage.vue";


const props = defineProps<{
    projects: Project[] | undefined;
}>();

const {projects} = toRefs(props);

const selectedTab = ref(0);
const filterOption = ref<FilterOptions>(FilterOptions.All);
const filteredProjects = computed(() => {
    const currentDate = new Date();
    if (filterOption.value === FilterOptions.All) {
        return projects.value || [];
    } else if (filterOption.value === FilterOptions.Active) {
        return (projects.value || []).filter(project => project.deadline > currentDate);
    } else if (filterOption.value === FilterOptions.Completed) {
        return (projects.value || []).filter(project => project.deadline <= currentDate);
    }
    console.error("Invalid filter option");
    return [];
});

const updateSelectedTab = (tabIndex) => {
    selectedTab.value = tabIndex;
};

const updateFilterOption = (option) => {
    filterOption.value = option;
};

</script>

<style scoped>

</style>
