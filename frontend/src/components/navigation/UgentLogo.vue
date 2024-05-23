<template>
    <div v-if="selectedLocale === 'en'" class="ugent-logo">
        <img alt="Logo" class="logo" src="@/assets/ghent-university-logo-white.png" height="150" />
    </div>
    <div v-else class="ugent-logo">
        <img alt="Logo" class="logo" src="@/assets/universiteit-gent-logo-white.png" height="150" />
    </div>
</template>

<script setup lang="ts">
import { useLocaleStore } from "@/stores/locale-store";
import { storeToRefs } from "pinia";

const { selectedLocale } = storeToRefs(useLocaleStore());
</script>

<style scoped></style>
