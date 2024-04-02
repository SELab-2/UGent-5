<template>
    <v-app>
        <div v-if="!hideHeader">
            <v-app-bar>
                <ApolloHeader />
            </v-app-bar>
            <v-navigation-drawer v-model="navOpen" app>
                <HomeScreenNav :navigations="navigations" />
            </v-navigation-drawer>
        </div>
        <v-main>
            <RouterView />
        </v-main>
    </v-app>
</template>

<script setup lang="ts">
import { RouterView, useRouter } from "vue-router";
import ApolloHeader from "@/components/ApolloHeader.vue";
import HomeScreenNav from "@/components/navigation/HomeScreenNav.vue";
import { computed, onBeforeMount, ref, provide } from "vue";
import { useI18n } from "vue-i18n";
import { useLocale } from "@/stores/locale-store";

const { currentRoute } = useRouter();
const hideHeader = computed(() => currentRoute.value.meta.hideHeader);

onBeforeMount(() => {
    const { locale } = useI18n();
    const { selectedLocale } = useLocale();
    locale.value = selectedLocale;
});

const navigations = ref([
    { icon: "mdi-school-outline", title: "navigation.courses" },
    { icon: "mdi-book-check-outline", title: "navigation.projects" },
    { icon: "mdi-cog-outline", title: "navigation.settings" },
]);

const navOpen = ref(true);

function toggleNav() {
    navOpen.value = !navOpen.value;
};

provide("toggleNav", toggleNav);
provide("navOpen", navOpen);
</script>
