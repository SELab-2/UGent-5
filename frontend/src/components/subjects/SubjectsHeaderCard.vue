<template>
    <v-card variant="text" class="title-card" height="165" width="50%" rounded="xl">
        <v-skeleton-loader :loading="isLoading" type="card" color="white">
            <v-row>
                <v-col>
                    <v-card-title class="title">
                        {{ $t("subjects.title") }}
                    </v-card-title>
                    <v-card-text>
                        <HeaderSubtitleButton
                            :title="$t('subject.academy_year') + ' ' + academicYears[0]"
                            :clickable="true"
                            :active="true"
                        ></HeaderSubtitleButton>
                        <v-chip-group>
                            <v-chip
                                v-for="(academicYear, index) in academicYears"
                                :key="index"
                                color="primary"
                                class="ma-1"
                            >
                                {{ academicYear }}
                            </v-chip>
                        </v-chip-group>
                    </v-card-text>
                </v-col>
            </v-row>
        </v-skeleton-loader>
    </v-card>
</template>

<script setup lang="ts">
import HeaderSubtitleButton from "@/components/buttons/HeaderSubtitleButton.vue";

defineProps<{
    isLoading: boolean;
}>();

const academicYears = ["2023-2024", "2022-2023", "2021-2022"];
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
</style>
