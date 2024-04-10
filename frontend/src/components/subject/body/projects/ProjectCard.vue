<template>
    <v-card
        class="mx-auto"
        variant="outlined"
        rounded="xl"
    >

        <v-card-item>
            <v-row>
                <v-col cols="10">
                    <v-card-title>
                        <div class="d-flex ma-2 deadline-container">
                            <v-icon>mdi-calendar-clock</v-icon>
                            <span class="title">{{ project?.name }}</span>
                        </div>
                    </v-card-title>
                    <v-card-subtitle>
                        <div class="d-flex deadline-container">
                            <v-icon size="x-small">mdi-alarm</v-icon>
                            <p class="deadline">{{ project?.deadline }}</p>
                        </div>
                    </v-card-subtitle>
                </v-col>
                <v-col cols="2" class="d-flex align-center justify-center">

                    <v-icon size="x-large" class="align-center">mdi-chevron-right</v-icon>


                </v-col>
            </v-row>
            <v-card-actions>
                <v-row>
                    <v-btn
                        rounded="xl"
                    >
                        Group 5
                        <v-menu activator="parent" open-on-hover location="end center" >
                            <v-list>
                                <v-list-item v-for="member in groupMembers" :key="member">
                                    <v-list-item-title>Member {{ member }}</v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </v-btn>
                </v-row>

            </v-card-actions>
        </v-card-item>


    </v-card>

</template>

<script setup lang="ts">

import type Project from "@/models/Project";
import {ref} from "vue";

defineProps<{
    project: Project;
}>();
const menuOpen = ref(false);
const groupMembers = ref<number[]>([1, 2, 3]);

</script>

<style scoped>

.title {
    font-size: 25px;
    font-family: 'Poppins', sans-serif;
    font-weight: bold;
    margin-left: 10px;
    margin-bottom: -2px;
}

.deadline {
    margin-left: 2px;
    font-size: 12px;
    margin-top: -3px;
}

.deadline-container {
    margin-left: 50px;
}


</style>
