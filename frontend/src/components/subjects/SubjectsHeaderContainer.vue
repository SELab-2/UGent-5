<template>
    <SubjectsHeaderCard :is-loading="isLoading"> </SubjectsHeaderCard>
</template>

<script setup lang="ts">
import SubjectsHeaderCard from "@/components/subjects/SubjectsHeaderCard.vue";

defineProps<{
    isLoading: boolean;
}>();
</script>

<style scoped></style>
