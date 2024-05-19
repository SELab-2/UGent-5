<template>
    <div class="notfound">
        <img alt="404" class="image" :src="imageSrc" />
        <h1>{{ $t("default.error.not-found") }}</h1>
    </div>
</template>

<script setup lang="ts">
import { useThemeStore } from "@/stores/theme-store";
import { storeToRefs } from "pinia";
const { selectedTheme } = storeToRefs(useThemeStore());
import { computed, ref, watch } from "vue";

import blackThemeImg from "@/assets/404_black.png";
import whiteThemeImg from "@/assets/404_white.png";

const theme = ref("");

const imageSrc = computed(() => {
    return theme.value === "black" ? blackThemeImg : whiteThemeImg;
});

watch(
    selectedTheme,
    (newTheme) => {
        theme.value = newTheme === "lightTheme" ? "black" : "white";
    },
    { immediate: true }
);
</script>

<style scoped>
.image {
    height: 100px;
}

.notfound {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 100px;
}
</style>
