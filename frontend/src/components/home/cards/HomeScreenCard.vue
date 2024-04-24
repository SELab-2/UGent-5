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
    background-color: white;
    color: black;
    border-radius: 5px;
}
</style>
