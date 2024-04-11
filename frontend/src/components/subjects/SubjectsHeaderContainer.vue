<template>
    <SubjectsHeaderCard :is-loading="isLoading">
    </SubjectsHeaderCard>


</template>

<script setup lang="ts">

import SubjectsHeaderCard from "@/components/subjects/SubjectsHeaderCard.vue";

defineProps<{
    isLoading: Boolean | undefined,
}>();
</script>

<style scoped>

</style>
