<template>
    <v-card variant="text" :title="$t(title)" class="card">
        <slot></slot>
    </v-card>
</template>

<script setup lang="ts">
defineProps<{
    title: string;
}>();
</script>

<style scoped>
.card {
    background-color: white;
    color: black;
    border-radius: 20px;
}
</style>
