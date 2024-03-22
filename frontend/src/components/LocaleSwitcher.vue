<template>
    <div>
        <v-btn @click="onLocaleChange(availableLocales[0])"> {{ availableLocales[0] }} </v-btn>
        | <v-btn @click="onLocaleChange(availableLocales[1])"> {{ availableLocales[1] }}</v-btn>
    </div>
</template>

<script setup lang="ts">
import { useLocale } from "@/stores/locale-store";
import { useI18n } from "vue-i18n";

const { locale, availableLocales } = useI18n();
const { setLocale } = useLocale();

function onLocaleChange(newLocale: string) {
    setLocale(newLocale);
}
</script>

<style lang="scss" scoped></style>
