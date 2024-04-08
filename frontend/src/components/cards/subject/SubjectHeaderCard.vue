<template>
    <v-card variant="text" class="title-card">
        <v-card-title>
            {{ title }}
        </v-card-title>
        <v-card-item>
            <v-row>
                <v-col>
                    <HeaderSubtitleButton title="academic_year" />
                </v-col>
            </v-row>
            <v-row>
                <v-col v-for="instructor in instructors" :key="instructor?.id">
                    <HeaderSubtitleButton :title="instructor?.name" />
                </v-col>
            </v-row>
        </v-card-item>
    </v-card>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import type User from "@/models/User";
import HeaderSubtitleButton from "@/components/buttons/HeaderSubtitleButton.vue";
const props = defineProps<{
    title: string,
    academicYear: string,
    instructors: User[],
}>();

</script>

<style scoped>

.title-card {
    background-color: white;
    padding: 20px;
    border-radius: 50px;
}

</style>
