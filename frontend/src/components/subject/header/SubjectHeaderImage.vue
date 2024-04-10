<template>
    <v-skeleton-loader type="image" class="header-img" :loading="isLoading">
        <v-img
            aspect-ratio="16/9"
            cover
            :src="imagePath"
            class="header-img"
            @load="isLoading === false"
        ></v-img>
    </v-skeleton-loader>
</template>

<script setup lang="ts">
import {toRef} from "vue";

const props = defineProps<{
    imagePath: string,
    isLoading: boolean,
}>();

const {isLoading} = toRef( props, 'isLoading');

</script>

<style scoped>
.header-img {
    border-radius: 20px;
    height: 165px;
}
</style>
