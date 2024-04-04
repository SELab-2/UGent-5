<template>
    <v-card variant="text" :title="$t(title)"> </v-card>
</template>

<script setup lang="ts">
defineProps<{
    title: string;
}>();
</script>

<style scoped>
.v-card {
    background-color: white;
    color: black;
    border-radius: 20px;
}
</style>
