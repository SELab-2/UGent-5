<template>
    <v-img aspect-ratio="16/9" cover :src="imagePath" class="header-img"> </v-img>
</template>

<script setup lang="ts">
defineProps<{
    imagePath: string;
}>();
</script>

<style scoped>
.header-img {
    height: 325px;
}
</style>
