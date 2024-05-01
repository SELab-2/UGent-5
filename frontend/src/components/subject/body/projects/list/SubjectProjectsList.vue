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
                        <v-tab v-for="project in projects" :key="project.id" :value="project.id">
                            <SubjectTab :projectName="project.name"></SubjectTab>
                        </v-tab>
                    </v-tabs>
                    <div v-else class="placeholder">
                        <p>{{$t("subject.projectsPage.no_projects")}}</p>
                    </div>
                </div>
            </v-card-text>
        </v-skeleton-loader>
    </v-card>
</template>

<script setup lang="ts">
import SubjectTab from "@/components/subject/body/projects/list/SubjectTab.vue";
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
    max-height: 55vh;
}

.title {
    font-size: 32px;
    letter-spacing: -0.5px;
    font-weight: bold;
    margin-bottom: 20px;
    font-family: "Poppins", sans-serif;
}

.scrollable-tabs {
    overflow-y: auto;
    scrollbar-width: none; /* For Firefox */
    max-height: 30vh;
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
