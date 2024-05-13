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
import { computed, ref } from "vue";

const navBar = ref<InstanceType<typeof NavBar> | null>(null);

const currentRoute = useRoute();
const hideHeader = computed(() => currentRoute.meta.hideHeader);
</script>

<style>
.v-main {
    background-color: rgb(var(--v-theme-background));
}
</style>
