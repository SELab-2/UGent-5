<template>
    <v-card variant="text" class="projects-card" max-height="400px">
        <v-card-title>
            <span class="title">{{ $t('subject.projects') }}</span>
        </v-card-title>
        <v-card-subtitle>
            <div class="d-flex justify-start filter-btn-container">
                <HeaderSubtitleButton
                    :title="$t('subject.projectsPage.all')"
                    clickable
                    :active="activeButton === FilterOptions.All"
                    @click="activeButton = FilterOptions.All"
                ></HeaderSubtitleButton>
                <HeaderSubtitleButton
                    :title="$t('subject.projectsPage.active')"
                    clickable
                    :active="activeButton === FilterOptions.Active"
                    @click="activeButton = FilterOptions.Active"
                ></HeaderSubtitleButton
                >
                <HeaderSubtitleButton
                    :title="$t('subject.projectsPage.completed')"
                    clickable
                    :active="activeButton === FilterOptions.Completed"
                    @click="activeButton = FilterOptions.Completed"
                ></HeaderSubtitleButton>
            </div>
        </v-card-subtitle>
        <v-card-text class="projects-tab">
            <v-tabs direction="vertical" show-arrows v-model="selectedTab" class="projects-tab">
                <v-tab v-for="project in projects" :key="project.id">
                    <SubjectTab :projectName="project?.name"></SubjectTab>

                </v-tab>
            </v-tabs>
        </v-card-text>
    </v-card>

</template>

<script setup lang="ts">
import SubjectTab from "@/components/subject/body/projects/list/SubjectTab.vue"
import HeaderSubtitleButton from "@/components/buttons/HeaderSubtitleButton.vue";
import type Project from "@/models/Project";
import {FilterOptions} from "@/models/Project";
import {ref, watch} from "vue";

const props = defineProps<{
    projects: Project[] | undefined;
    selectedTab: number | undefined;
}>();


const selectedTab = ref(props.selectedTab);

const activeButton = ref(FilterOptions.All);

const emit = defineEmits<{
    (e: 'tab-changed', projectId: number): void;
    (e: 'filter-changed', filter: string): void;
}>();

watch(selectedTab, (newVal: number | undefined) => {
    if (newVal !== undefined) {
        emit('tab-changed', newVal);
    }
});

watch(activeButton, (newVal: string) => {
    emit('filter-changed', newVal);
    selectedTab.value = 0
});

</script>

<style scoped>


.projects-card {
    background-color: white;
    padding: 20px;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
}

.title {
    font-size: 32px;
    letter-spacing: -0.5px;
    font-weight: bold;
    margin-bottom: 20px;
    font-family: 'Poppins', sans-serif;
}

.projects-tab {
    flex-grow: 1;
    overflow-y: auto;
}

.projects-tab::-webkit-scrollbar {
    width: 0; /* For Chrome, Safari, and Opera */
}

.filter-btn-container {
    overflow-x: auto;
}

.filter-btn-container::-webkit-scrollbar {
    width: 0; /* For Chrome, Safari, and Opera */
}



</style>
