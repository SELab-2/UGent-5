<template>
    <div class="container">
        <v-switch
            class="switcher"
            color="white"
            v-model="selectedTheme"
            false-value="darkTheme"
            false-icon="mdi-moon-waning-crescent"
            true-value="lightTheme"
            true-icon="mdi-white-balance-sunny"
        ></v-switch>
    </div>
</template>

<script setup lang="ts">
import { useThemeStore } from "@/stores/theme-store";
import { storeToRefs } from "pinia";

const { selectedTheme } = storeToRefs(useThemeStore());
</script>

<style scoped>
.container {
    display: flex;
    align-items: center;
}
.switcher {
    margin-left: 5px;
    margin-right: 10px;
    display: flex;
}
</style>
