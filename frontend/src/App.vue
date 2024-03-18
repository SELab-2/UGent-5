<template>
    <v-app>
        <v-main>
            <ApolloHeader v-if="!hideHeader" />
            <router-view />
        </v-main>
    </v-app>
</template>

<script setup lang="ts">
import { defineComponent, computed } from "vue";
import { useRouter } from "vue-router";
import ApolloHeader from "@/components/ApolloHeader.vue";
const router = useRouter();
const hideHeader = computed(() => router.currentRoute.value.meta.hideHeader === true);
</script>
