import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { useTheme } from "vuetify";

export const useThemeStore = defineStore("theme", () => {
    const theme = useTheme();

    const selectedTheme = ref(localStorage.getItem("theme") || theme.global.name.value);

    function setTheme(newTheme: string) {
        theme.global.name.value = newTheme;
        localStorage.setItem("theme", newTheme);
    }

    watch(
        selectedTheme,
        (newTheme) => {
            setTheme(newTheme);
        },
        { immediate: true }
    );

    return { selectedTheme, setTheme };
});
