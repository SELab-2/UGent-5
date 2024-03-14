<template>
    <ApolloHeader v-if="!hideHeader" />
    <RouterView />
</template>

<script setup lang="ts">
import { RouterView, useRouter } from "vue-router";
import ApolloHeader from "@/components/ApolloHeader.vue";
import { computed } from "vue";
const router = useRouter();
const hideHeader = computed(() => router.currentRoute.value.meta.hideHeader === true);
</script>

<style scoped></style>
