<template>
    <v-row>
        <v-col cols="6">
            <SubjectsHeaderCard :is-loading="isLoading"></SubjectsHeaderCard>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import SubjectsHeaderCard from "@/components/subjects/SubjectsHeaderCard.vue";

defineProps<{
    isLoading: boolean;
}>();
</script>

<style scoped></style>
