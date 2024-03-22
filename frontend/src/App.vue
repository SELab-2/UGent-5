<template>
    <v-app>
        <v-app-bar>
            <ApolloHeader v-if="!hideHeader" />
        </v-app-bar>
        <v-main>
            <RouterView />
        </v-main>
    </v-app>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import ApolloHeader from "@/components/ApolloHeader.vue";
const { currentRoute } = useRouter();
const hideHeader = computed(() => currentRoute.value.meta.hideHeader === true);
</script>
