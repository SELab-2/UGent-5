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
                <v-window-item
                    v-for="project in filteredProjects"
                    :key="project.id"
                    :value="project.id"
                >
                    <SubjectProjectPage
                        :selected-tab="selectedTab"
                        :project="project"
                    ></SubjectProjectPage>
                </v-window-item>
                <v-window-item v-if="filteredProjects.length === 0" :key="'placeholder'">
                    <div class="placeholder">
                        <p>{{ $t("subject.projectsPage.no_projects") }}</p>
                    </div>
                </v-window-item>
            </v-window>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import SubjectProjectsList from "@/components/subject/subject/body/projects/list/SubjectProjectsList.vue";
import type Project from "@/models/Project";
import { FilterOptions } from "@/models/Project";
import { computed, ref, toRefs } from "vue";
import SubjectProjectPage from "@/components/subject/subject/body/projects/SubjectProjectPage.vue";

const props = defineProps<{
    projects: Project[];
}>();

const { projects } = toRefs(props);
const selectedTab = ref(0);
const filterOption = ref<FilterOptions>(FilterOptions.All);

const filteredProjects = computed(() => {
    const currentDate = new Date();
    let sortedProjects = [...(projects.value || [])];
    sortedProjects.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
    if (filterOption.value === FilterOptions.All) {
        return sortedProjects;
    } else if (filterOption.value === FilterOptions.Active) {
        return sortedProjects.filter((project) => new Date(project.deadline) > currentDate);
    } else if (filterOption.value === FilterOptions.Completed) {
        return sortedProjects.filter((project) => new Date(project.deadline) <= currentDate);
    }
    return sortedProjects;
});

const updateSelectedTab = (tabIndex: number) => {
    selectedTab.value = tabIndex;
};

const updateFilterOption = (option: FilterOptions) => {
    filterOption.value = option;
    if (filteredProjects.value.length > 0) {
        updateSelectedTab(filteredProjects.value[0].id);
    }
};
</script>

<style scoped>
.placeholder {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 400px; /* Adjust height as needed */
    border-radius: 3px;
    background-color: rgb(var(--v-theme-background));
}

.placeholder p {
    font-size: 18px;
    color: #666;
}
</style>
