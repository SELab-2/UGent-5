<template>
    <h1>{{ selectedTab }}</h1>
</template>

<script setup lang="ts">
defineProps<{
    selectedTab: number;
}>();
</script>

<style scoped>

</style>
