<template>
    <v-app-bar>
        <v-app-bar-nav-icon variant="text" @click="emit('toggleNav')"></v-app-bar-nav-icon>
        <RouterLink to="/">
            <img alt="Logo" class="logo" src="@/assets/logo_white_transparant.png" />
        </RouterLink>
        <div class="leftContent">
            <v-btn variant="text" class="logout" @click="logout"> logout </v-btn>
            <LocaleSwitcher />
        </div>
    </v-app-bar>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
import LocaleSwitcher from "./LocaleSwitcher.vue";
import { useAuthStore } from "@/stores/auth-store";

const emit = defineEmits<{
    (e: "toggleNav"): void;
}>();

const { logout } = useAuthStore();
</script>

<style scoped>
.logo {
    max-height: 50px;
    margin-right: auto;
}

.v-app-bar {
    padding: 5px 0px;
}

.leftContent {
    margin-left: auto;
    display: flex;
    align-items: center;
}

.logout {
    margin-right: 15px;
}
</style>
