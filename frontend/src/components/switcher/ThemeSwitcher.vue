<template>
    <div class="container">
        <v-switch
            class="switcher"
            color="white"
            v-model="switchValue"
            false-value="darkTheme"
            false-icon="mdi-moon-waning-crescent"
            true-value="lightTheme"
            true-icon="mdi-white-balance-sunny"
            @update:model-value="(value) => onThemeChange(value!)"
        ></v-switch>
    </div>
</template>

<script setup lang="ts">
import { useTheme } from "vuetify";
import { ref } from "vue";
import { useThemeStore } from "@/stores/theme-store";
const { storedTheme, setTheme } = useThemeStore();

const switchValue = ref(storedTheme);
const theme = useTheme();

function onThemeChange(value: string) {
    theme.global.name.value = value;
    setTheme(value);
}
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
