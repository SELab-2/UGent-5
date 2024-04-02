<template>
    <v-app>
        <v-app-bar v-if="!hideHeader">
            <ApolloHeader />
        </v-app-bar>
        <v-main>
            <RouterView />
        </v-main>
    </v-app>
    <VueQueryDevtools />
</template>

<script setup lang="ts">
import { RouterView, useRouter } from "vue-router";
import ApolloHeader from "@/components/ApolloHeader.vue";
import { VueQueryDevtools } from "@tanstack/vue-query-devtools";
import { computed, onBeforeMount } from "vue";
import { useI18n } from "vue-i18n";
import { useLocale } from "@/stores/locale-store";

const { currentRoute } = useRouter();
const hideHeader = computed(() => currentRoute.value.meta.hideHeader === true);
onBeforeMount(() => {
    const { locale } = useI18n();
    const { selectedLocale } = useLocale();
    locale.value = selectedLocale;
});
</script>
