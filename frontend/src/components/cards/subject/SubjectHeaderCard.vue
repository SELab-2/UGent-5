<template>
    <v-card variant="text" class="title-card" width="500px">
        <v-skeleton-loader :loading="isLoading" type="card" color="white">
            <v-row>
                <v-col>
                    <v-card-title
                        class="title"
                    >
                        {{ title }}
                    </v-card-title>
                    <v-card-text>
                        <v-row>
                            <v-col>
                                <HeaderSubtitleButton :title="`academic year ${academicYear}`" :clickable="false"/>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col v-for="instructor in instructors" :key="instructor?.uid">
                                <HeaderSubtitleButton :title="instructor?.given_name" :clickable="false"/>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-col>
            </v-row>

        </v-skeleton-loader>
    </v-card>
</template>

<script setup lang="ts">
import type User from "@/models/User";
import HeaderSubtitleButton from "@/components/buttons/HeaderSubtitleButton.vue";

defineProps<{
    title: string,
    academicYear: string,
    instructors: User[],
    isLoading: boolean,
}>();

</script>

<style scoped>

.title-card {
    background-color: white;
    padding: 20px;
    border-radius: 20px;
}

.title {
    font-size: 32px;
    letter-spacing: -0.5px;
    font-weight: bold;
    margin-bottom: 20px;
    font-family: 'Poppins', sans-serif;
}


</style>
