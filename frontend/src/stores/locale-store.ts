import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";

function getBrowserLocale(): string {
    return window.navigator.language.split("-")[0];
}

export const useLocaleStore = defineStore("locale", () => {
    const { locale } = useI18n();
    const storedLocale = localStorage.getItem("locale");
    const selectedLocale = ref<string>(storedLocale || getBrowserLocale());

    function setLocale(newLocale: string) {
        locale.value = newLocale;
        localStorage.setItem("locale", newLocale);
    }

    watch(
        selectedLocale,
        (newLocale) => {
            setLocale(newLocale);
        },
        { immediate: true }
    );

    return { selectedLocale, setLocale };
});
