import { defineStore } from "pinia";
import { ref } from "vue";

function getBrowserLocale(): string {
    return window.navigator.language.split("-")[0];
}

export const useLocale = defineStore("locale", () => {
    const storedLocale = localStorage.getItem("locale");
    const selectedLocale = ref<string>(storedLocale || getBrowserLocale());

    function setLocale(newLocale?: string) {
        if (!newLocale) {
            return;
        }
        selectedLocale.value = newLocale;
        localStorage.setItem("locale", newLocale);
    }

    return { selectedLocale, setLocale };
});
