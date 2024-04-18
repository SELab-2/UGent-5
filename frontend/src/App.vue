<template>
    <v-app>
        <div v-if="!hideHeader">
            <ApolloHeader @toggleNav="navBar?.toggleNav" />
            <NavBar ref="navBar" />
        </div>
        <v-main>
            <RouterView />
        </v-main>
    </v-app>
    <VueQueryDevtools />
</template>

<script setup lang="ts">
import { RouterView, useRoute } from "vue-router";
import ApolloHeader from "@/components/ApolloHeader.vue";
import { VueQueryDevtools } from "@tanstack/vue-query-devtools";
import NavBar from "@/components/navigation/NavBar.vue";
import { computed, onBeforeMount, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useLocale } from "@/stores/locale-store";

const navBar = ref<InstanceType<typeof NavBar> | null>(null);

const currentRoute = useRoute();
const hideHeader = computed(() => currentRoute.meta.hideHeader);

onBeforeMount(() => {
    const { locale } = useI18n();
    const { selectedLocale } = useLocale();
    locale.value = selectedLocale;
});
</script>
