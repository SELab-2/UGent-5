<template>
    <v-row>
        <v-col cols="5">
            <SubjectProjectsList
                :projects="filteredProjects"
                :selected-tab="selectedTab"
                :is-loading="isLoading"
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
                        :is-loading="isLoading"
                    ></SubjectProjectPage>
                </v-window-item>

                <v-window-item v-if="filteredProjects?.length === 0" :key="'placeholder'">
                    <div class="placeholder">
                        <p>No projects available.</p>
                    </div>
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
    isLoading: boolean | undefined
}>();

const {projects} = toRefs(props);
const selectedTab = ref(0);
const filterOption = ref<FilterOptions>(FilterOptions.All);

const filteredProjects = computed(() => {
    const currentDate = new Date();
    let sortedProjects = [...(projects.value || [])];
    sortedProjects.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    if (filterOption.value === FilterOptions.All) {
        return sortedProjects;
    } else if (filterOption.value === FilterOptions.Active) {
        return sortedProjects.filter(project => new Date(project.deadline) > currentDate);
    } else if (filterOption.value === FilterOptions.Completed) {
        return sortedProjects.filter(project => new Date(project.deadline) <= currentDate);
    }
    console.error("Invalid filter option");
    return sortedProjects
});

const updateSelectedTab = (tabIndex) => {
    selectedTab.value = tabIndex;
};

const updateFilterOption = (option) => {
    filterOption.value = option;
    updateSelectedTab(0);
};

</script>

<style scoped>

.placeholder {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 400px; /* Adjust height as needed */
    border: 1px solid #ccc;
    border-radius: 8px;
}

.placeholder p {
    font-size: 18px;
    color: #666;
}


</style>
