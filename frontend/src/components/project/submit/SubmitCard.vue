<template>
    <v-card>
        <v-card-item>
            <v-card-title>{{ $t("submit.submit_title") }}</v-card-title>
        </v-card-item>
        <v-container class="card-container">
            <v-row>
                <v-col>
                    <ProjectMiniCard :projectId="projectId" />
                </v-col>
                <v-spacer />
                <v-spacer />
            </v-row>
            <v-row>
                <v-col>
                    <h1>
                        {{ $t("submit.add_files") }}
                    </h1>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <SubmitForm :projectId="projectId" />
                </v-col>
            </v-row>
        </v-container>
    </v-card>
</template>

<script setup lang="ts">
import ProjectMiniCard from "@/components/project/ProjectMiniCard.vue";
import SubmitForm from "@/components/project/submit/SubmitForm.vue";

defineProps({
    projectId: Number,
});
</script>

<style scoped>
.card-container {
    background-color: var(--gray-8);
}
</style>
