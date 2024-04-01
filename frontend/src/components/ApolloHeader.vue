<template>
    <div class="header">
        <v-app-bar-nav-icon variant="text" @click="toggleNav"></v-app-bar-nav-icon>
        <RouterLink to="/" >
            <img alt="Logo" class="logo" src="@/assets/logo_white_transparant.png" />
        </RouterLink>
        <v-btn variant="text" class="logout" @click="logout"> logout  </v-btn>
        <LocaleSwitcher style="margin-left: auto" />
    </div>
</template>


<script setup lang="ts">
import { RouterLink } from "vue-router";
import HomeScreenNav from "./navigation/HomeScreenNav.vue"
import LocaleSwitcher from "./LocaleSwitcher.vue";
import { useAuthStore } from "@/stores/auth-store.ts"
import { inject } from 'vue';

const toggleNav = inject('toggleNav');
const { logout } = useAuthStore();
</script>

<style scoped>
.logo {
    max-width: 80%;
    max-height: 70px;
    margin-right: auto;
}

.header {
    padding: 5px 0px;
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
}

.logout {
    margin-left: 60%
}
</style>
