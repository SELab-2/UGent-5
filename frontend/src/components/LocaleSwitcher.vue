<template>
    <div class="switcher">
        <v-btn variant="plain" @click="handleLocaleChange(availableLocales[0])">
            {{ availableLocales[0] }}
        </v-btn>
        |
        <v-btn variant="plain" @click="handleLocaleChange(availableLocales[1])">
            {{ availableLocales[1] }}</v-btn
        >
    </div>
</template>

<script setup lang="ts">
import { useLocale } from "@/stores/locale-store";
import { useI18n } from "vue-i18n";

const { setLocale } = useLocale();
const { locale, availableLocales } = useI18n();

function handleLocaleChange(selectedLocale) {
    locale.value = selectedLocale;
    setLocale(selectedLocale);
}
</script>

<style lang="scss" scoped>
.switcher {
    color: #ffffff;
}
</style>
