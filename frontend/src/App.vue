<template>
    <v-app>
        <div v-if="!hideHeader">
            <ApolloHeader @toggleNav="navBar?.toggleNav" />
            <NavBar ref="navBar" :navigations="navigations" />
        </div>
        <v-main>
            <RouterView />
        </v-main>
    </v-app>
</template>

<script setup lang="ts">
import { RouterView, useRouter } from "vue-router";
import ApolloHeader from "@/components/ApolloHeader.vue";
import NavBar from "@/components/navigation/NavBar.vue";
import { computed, onBeforeMount, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useLocale } from "@/stores/locale-store";

const navBar = ref<InstanceType<typeof NavBar> | null>(null);

const { currentRoute } = useRouter();
const hideHeader = computed(() => currentRoute.value.meta.hideHeader);

onBeforeMount(() => {
    const { locale } = useI18n();
    const { selectedLocale } = useLocale();
    locale.value = selectedLocale;
});

const navigations = ref([
    { icon: "mdi-school-outline", title: "navigation.courses", goto: "about" },
    { icon: "mdi-book-check-outline", title: "navigation.projects", goto: "about" },
    { icon: "mdi-cog-outline", title: "navigation.settings", goto: "about" },
]);
</script>
