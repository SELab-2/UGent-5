import { defineStore } from "pinia";
import { ref } from "vue";

export const useThemeStore = defineStore("theme", () => {
    const storedTheme = ref(localStorage.getItem("theme"));

    function setTheme(newTheme?: string | null) {
        if (!newTheme) {
            return;
        }
        storedTheme.value = newTheme;
        localStorage.setItem("theme", newTheme);
    }

    return { storedTheme, setTheme };
});
