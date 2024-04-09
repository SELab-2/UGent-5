<template>
    <v-tabs v-model="tab" align-tabs="center" grow slider-color="#003EFF">
        <v-tab
            v-for="(item, index) in items"
            :key="index"
            :value="index"
            class="page-tab"

        >{{ $t(`subject.${item}`) }}
        </v-tab>
    </v-tabs>

    <v-window v-model="tab">
        <v-window-item :value="0">
            <SubjectProjectsPage
                :projects="projects"
            ></SubjectProjectsPage>
        </v-window-item>
        <v-window-item :value="1">
            <SubjectAnnouncementsPage/>
        </v-window-item>
        <v-window-item :value="2">
            <SubjectGroupsPage/>
        </v-window-item>
    </v-window>
</template>

<script setup lang="ts">
import SubjectProjectsPage from "@/components/subject/body/SubjectProjectsPage.vue";
import SubjectAnnouncementsPage from "@/components/subject/body/SubjectAnnouncementsPage.vue";
import SubjectGroupsPage from "@/components/subject/body/SubjectGroupsPage.vue";

import {ref} from "vue";
import type Project from "@/models/Project";

defineProps<{
    projects: Project[] | undefined;
}>()

const items = ["projects", "announcements", "groups"];
const tab = ref(0);

</script>

<style scoped>

.page-tab {
    font-size: 20px;
    font-weight: 500;
    font-family: 'Poppins', sans-serif;
    text-transform: capitalize;
    background-color: white;

}


</style>
