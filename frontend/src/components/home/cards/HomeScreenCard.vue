<template>
    <v-card :title="$t(title)" class="card" variant="flat">
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
    background-color: rgb(var(--v-theme-secondary));
    color: rgb(var(--v-theme-text));
    border-radius: 2px;
    text-transform: capitalize;
}
</style>
