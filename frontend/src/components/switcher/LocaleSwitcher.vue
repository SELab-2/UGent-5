<template>
    <div class="switcher">
        <template v-for="(availableLocale, index) in availableLocales" :key="availableLocale">
            <v-btn
                variant="text"
                :class="availableLocale === selectedLocale ? 'selected-option' : 'locale-option'"
                @click="selectedLocale = availableLocale"
            >
                {{ availableLocale }}
            </v-btn>
            <span v-if="index !== availableLocales.length - 1">|</span>
        </template>
    </div>
</template>

<script setup lang="ts">
import { useLocaleStore } from "@/stores/locale-store";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";

const { availableLocales } = useI18n();
const { selectedLocale } = storeToRefs(useLocaleStore());
</script>

<style lang="scss" scoped>
.switcher {
    color: rgb(var(--v-theme-navtext));
    display: flex;
    align-items: center;
}

.locale-option {
    color: var(--color-text-subtle);
}

.selected-option {
    color: rgb(var(--v-theme-navtext));
    font-style: bold;
}
</style>
