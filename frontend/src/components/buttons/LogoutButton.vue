<template>
    <v-btn variant="text" class="logout" @click="logout"> {{ $t("logout") }} </v-btn>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth-store";

const { logout } = useAuthStore();
</script>

<style scoped></style>
