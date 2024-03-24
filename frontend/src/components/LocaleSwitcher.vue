<template>
    <div class="switcher">
        <template v-for="(availableLocale, index) in availableLocales" :key="availableLocale">
            <v-btn variant="plain" @click="handleLocaleChange(availableLocale)">
                {{ availableLocale }}
            </v-btn>
            <span v-if="index !== availableLocales.length - 1">|</span>
        </template>
    </div>
</template>

<script setup lang="ts">
import { useLocale } from "@/stores/locale-store";
import { useI18n } from "vue-i18n";

const { setLocale } = useLocale();
const { locale, availableLocales } = useI18n();

function handleLocaleChange(selectedLocale: string) {
    locale.value = selectedLocale;
    setLocale(selectedLocale);
}
</script>

<style lang="scss" scoped>
.switcher {
    color: var(--white);
}
</style>
