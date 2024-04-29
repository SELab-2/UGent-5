<template>
    <v-skeleton-loader
        type="card"
        class="card-loader"
    >
        <v-card
            variant="text"
            class="title-card"
            rounded="xl"
            width="100%"
        >
            <v-row>
                <v-col>
                    <v-card-title class="title">
                        {{ $t("subjects.title") }}
                    </v-card-title>
                    <v-card-text>
                        <div class="chip_container">
                            <v-chip-group
                                mandatory
                                v-model="activeAcademicYear"
                                column
                            >
                                <v-chip
                                    v-for="(academicYear, index) in academicYears"
                                    :key="index"
                                    :value="index"
                                    color="primary"
                                    class="ma-1"
                                    variant="tonal"
                                >
                                    {{ academicYear }}
                                </v-chip>
                            </v-chip-group>
                        </div>

                    </v-card-text>
                </v-col>
            </v-row>
        </v-card>
    </v-skeleton-loader>

</template>

<script setup lang="ts">

import {ref} from "vue";

defineProps<{
    isLoading: boolean;
}>();

const academicYears = ["2023-2024", "2022-2023", "2021-2022"];
const activeAcademicYear = ref(0);
</script>

<style scoped>
.title-card {
    background-color: white;
    padding: 20px;
}

.title {
    font-size: 32px;
    letter-spacing: -0.5px;
    text-transform: capitalize;
    font-weight: bold;
    margin-bottom: 12px;
    font-family: "Poppins", sans-serif;
}

.chip_container {
    overflow-x: auto;
}

.card-loader {
    border-radius: 25px;

}

</style>
