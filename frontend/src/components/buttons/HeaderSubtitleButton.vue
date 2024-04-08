<template>
    <v-btn variant="outlined" rounded="xl"
    >{{title}}</v-btn>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
const props = defineProps<{
    title: string
}>();
</script>

<style scoped>

</style>
