<template>
    <v-skeleton-loader type="image" class="header-img" :loading="isLoading">
        <v-img
            aspect-ratio="16/9"
            cover
            :src="imagePath"
            class="header-img"
        ></v-img>
    </v-skeleton-loader>
</template>

<script setup lang="ts">

defineProps<{
    imagePath: string;
    isLoading: boolean;
}>();

</script>

<style scoped>
.header-img {
    border-radius: 20px;
    height: 165px;
}
</style>
