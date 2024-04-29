<template>
    <v-card variant="text" class="projects-card">
        <v-card-title>
            <span class="title">{{ $t("subject.projects") }}</span>
        </v-card-title>
        <v-card-subtitle>
            <v-chip-group
                v-model="activeButton"
                column
                mandatory
            >
                <v-chip
                    v-for="(filter, index) in filterOptions"
                    :key="index"
                    :value="FilterOptions[filter]"
                    color="primary"
                    variant="tonal"
                >
                    {{ $t(`subject.projectsPage.${filter.toLowerCase()}`) }}
                </v-chip>

            </v-chip-group>
            <!--div class="d-flex justify-start filter-btn-container">
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
                ></HeaderSubtitleButton>
                <HeaderSubtitleButton
                    :title="$t('subject.projectsPage.completed')"
                    clickable
                    :active="activeButton === FilterOptions.Completed"
                    @click="activeButton = FilterOptions.Completed"
                ></HeaderSubtitleButton>
            </div-->
        </v-card-subtitle>
        <v-skeleton-loader type="card" color="white">
            <v-card-text>
                <div class="scrollable-tabs">
                    <v-tabs
                        v-if="projects!.length > 0"
                        direction="vertical"
                        v-model="selectedTab"
                        show-arrows
                        prev-icon="mdi-chevron-up"
                        next-icon="mdi-chevron-down"
                    >
                        <v-tab v-for="project in projects" :key="project.id">
                            <SubjectTab :projectName="project.name"></SubjectTab>
                        </v-tab>
                    </v-tabs>
                    <div v-else class="placeholder">
                        <p>No projects available.</p>
                    </div>
                </div>
            </v-card-text>
        </v-skeleton-loader>
    </v-card>
</template>

<script setup lang="ts">
import SubjectTab from "@/components/subject/body/projects/list/SubjectTab.vue";
import HeaderSubtitleButton from "@/components/buttons/HeaderSubtitleButton.vue";
import type Project from "@/models/Project";
import { FilterOptions } from "@/models/Project";
import { ref, watch } from "vue";

const props = defineProps<{
    projects: Project[];
    selectedTab: number;
    isLoading: boolean;
}>();

const selectedTab = ref(props.selectedTab);

const filterOptions = Object.keys(FilterOptions);
const activeButton = ref(FilterOptions.All);

const emit = defineEmits<{
    (e: "tab-changed", projectId: number): void;
    (e: "filter-changed", filter: FilterOptions): void;
}>();

watch(selectedTab, (newVal: number | undefined) => {
    if (newVal !== undefined) {
        emit("tab-changed", newVal);
    }
    console.log("Selected tab changed to", newVal);
});

watch(activeButton, (newVal: string) => {
    emit("filter-changed", FilterOptions[newVal as keyof typeof FilterOptions]);
    selectedTab.value = 0;
});
</script>

<style scoped>
.projects-card {
    background-color: white;
    padding: 20px;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    max-height: 60vh;
}

.title {
    font-size: 32px;
    letter-spacing: -0.5px;
    font-weight: bold;
    margin-bottom: 20px;
    font-family: "Poppins", sans-serif;
}

.projects-tab {
    overflow-y: auto;
    scrollbar-width: none; /* For Firefox */
    max-height: 35vh;
}

.projects-tab::-webkit-scrollbar {
    width: 0; /* For Chrome, Safari, and Opera */
}

.filter-btn-container {
    overflow-x: auto;
    scrollbar-width: none; /* For Firefox */
}

.filter-btn-container::-webkit-scrollbar {
    width: 0; /* For Chrome, Safari, and Opera */
}

.scrollable-tabs {
    overflow-y: auto;
    scrollbar-width: none; /* For Firefox */
    max-height: 55vh;
}

.scrollable-tabs::-webkit-scrollbar {
    width: 0; /* For Chrome, Safari, and Opera */
}


.placeholder {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px; /* Adjust height as needed */
    border: 1px solid #ccc;
    border-radius: 8px;
}

.placeholder p {
    font-size: 18px;
    color: #666;
}
</style>
