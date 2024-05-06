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
        ></v-switch>
    </div>
</template>

<script setup lang="ts">
import { useTheme } from "vuetify";
import { ref, watch } from "vue";
import { useThemeStore } from "@/stores/theme-store";
const theme = useTheme();
const { storedTheme, setTheme } = useThemeStore();

const switchValue = ref(storedTheme);

watch(switchValue, (newValue) => {
    theme.global.name.value = newValue;
    setTheme(newValue);
    console.log(localStorage.getItem("theme"));
});
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
