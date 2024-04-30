<template>
    <div class="project-container">
        <v-card class="project-card" variant="text" rounded="xl">
            <router-link :to="{ name: 'project', params: { projectId: project.id } }" class="router">
                <div class="colored-zone"></div>
                <v-card-title class="title">
                    <v-row>
                        <v-col>
                            <span>{{ project.name }}</span>
                        </v-col>
                        <v-col class="text-right">
                            <v-icon size="small">mdi-arrow-right</v-icon>
                        </v-col>
                    </v-row>
                </v-card-title>
            </router-link>

            <v-card-text class="d-block py-3 deadline">
                <v-icon>mdi-alarm</v-icon>
                {{ $d(project.deadline, "long") }}
            </v-card-text>

            <v-card-text>
                <h2>{{ $t("subject.project.assignment") }}</h2>
                <p
                    v-if="project.description && project.description.length <= assignmentLength"
                    class="project_description"
                >
                    {{ project.description }}
                </p>
                <!-- Show truncated description if not expanded -->
                <p v-else-if="project.description && !expanded" class="project_description">
                    {{ project.description.substring(0, assignmentLength) + "..." }}
                </p>
                <!-- Show full description if expanded -->
                <v-expand-transition>
                    <div v-if="expanded">
                        <p class="project_description">{{ project.description }}</p>
                    </div>
                </v-expand-transition>
            </v-card-text>
            <!-- Toggle button for expanding/collapsing description -->
            <div v-if="project.description && project.description.length > assignmentLength">
                <v-divider></v-divider>
                <v-card-actions>
                    <v-btn @click="expanded = !expanded">
                        {{ !expanded ? "Show Full Assignment" : "Hide Assignment" }}
                    </v-btn>
                </v-card-actions>
            </div>
        </v-card>
        <v-card class="project-card" rounded="xl" variant="text">
            <v-card-title class="card_title">{{ $t("subject.project.group") }}</v-card-title>
        </v-card>

        <v-card class="project-card" rounded="xl" variant="text" height="410px">
            <v-card-title class="card_title">{{ $t("subject.project.submissions") }}</v-card-title>
        </v-card>
    </div>
</template>

<script setup lang="ts">
import type Project from "@/models/Project";
import {ref} from "vue";

defineProps<{
    selectedTab: number;
    project: Project;
    isLoading: boolean;
}>();

const expanded = ref(false);
const assignmentLength = 100;
</script>

<style scoped>
.project_description {
    font-size: 14px;
    line-height: 1.5;
    color: #333;
    margin-top: 10px;
    margin-left: 10px;
}

.project-card {
    background-color: white;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    margin-bottom: 10px;
}

.router {
    text-decoration: none;
    color: inherit;
}

.deadline {
    color: #181818;
}

.colored-zone {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 80px; /* Adjust the height as needed */
    background-color: var(--color-primary); /* Desired background color */
    border-radius: 20px 20px 0 0; /* Rounded corners for top half */
    z-index: -1; /* Ensure the colored zone is behind the card content */
}

.title {
    font-size: 30px;
    letter-spacing: -0.5px;
    font-weight: bold;
    margin-bottom: 20px;
    font-family: "Poppins", sans-serif;
    color: white;
    text-transform: capitalize;
}

.card_title {
    font-size: 24px;
    text-transform: capitalize;
    display: block;
    line-height: 1.2;
    font-weight: 500;
    color: black;
}

.chevron {
    margin-right: 10px;
    color: white;
    display: block;
}

.project-container {
    overflow: auto;
    max-height: 55vh;
    scrollbar-width: none; /* For Firefox */
}

.project-container::-webkit-scrollbar {
    width: 0; /* For Chrome, Safari, and Opera */
}
</style>
