<template>
    <v-card variant="text" class="title-card" height="165">
        <v-skeleton-loader :loading="isLoading" type="card" color="white">
            <v-row>
                <v-col>
                    <v-card-title
                        class="title"
                    >
                        {{ title }}
                    </v-card-title>
                    <v-card-text>
                        <HeaderSubtitleButton
                            :title="$t('subject.academy_year') + ' ' + academicYear"
                            :clickable="false"
                            :active="false"
                        ></HeaderSubtitleButton>
                        <div class="d-flex justify-start instr-container">
                            <HeaderSubtitleButton
                                v-for="instructor in instructors"
                                :key="instructor?.uid"
                                :title="instructor?.given_name"
                                :clickable="false"
                                :active="false"
                            ></HeaderSubtitleButton>
                        </div>
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
    title: string | undefined,
    academicYear: string,
    instructors: User[] | undefined,
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
    text-transform: capitalize;
    font-weight: bold;
    margin-bottom: 12px;
    font-family: 'Poppins', sans-serif;
}

.instr-container {
    margin-top: 10px;
    margin-bottom: 5px;
}


</style>
