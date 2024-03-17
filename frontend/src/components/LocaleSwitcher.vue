<template>
    <div>
        <select v-model="locale">
            <option
                v-for="availableLocale in availableLocales"
                :key="availableLocale"
                :value="availableLocale"
            >
                {{ availableLocale }}
            </option>
        </select>
    </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { locale, availableLocales } = useI18n();
</script>
