<template>
    <div>
        <select v-model="locale" @change="onLocaleChange">
            <option v-for="availableLocale in availableLocales" :key="availableLocale" :value="availableLocale">
                {{ availableLocale }}
            </option>
        </select>
    </div>
</template>

<script setup lang="ts">
import { useLocale } from "@/stores/locale-store";
import { useI18n } from "vue-i18n";

const { locale, availableLocales } = useI18n();
const { setLocale } = useLocale();

function onLocaleChange(event: Event) {
    setLocale((event.target as HTMLSelectElement).value);
}

</script>

<style lang="scss" scoped></style>
