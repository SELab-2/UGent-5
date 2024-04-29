<template>
    <v-skeleton-loader type="image" class="header-img">
        <v-img aspect-ratio="16/9" cover rounded="xl" :src="imagePath" class="header-img"></v-img>
    </v-skeleton-loader>
</template>

<script setup lang="ts">
defineProps<{
    imagePath: string;
}>();
</script>

<style scoped>
.header-img {
    border-radius: 25px;
    height: 165px;
}
</style>
