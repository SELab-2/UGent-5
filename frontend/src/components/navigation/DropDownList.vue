<template>
    <v-list class="items bg-primary">
        <v-list-item data-test="logoutButton" v-if="loggedInValue">
            <LogoutButton />
        </v-list-item>
        <v-list-item data-test="localeSwitcher">
            <LocaleSwitcher />
        </v-list-item>
        <v-list-item data-test="themeSwitcher">
            <themeSwitcher />
        </v-list-item>
    </v-list>
</template>

<script setup lang="ts">
import LocaleSwitcher from "@/components/switcher/LocaleSwitcher.vue";
import LogoutButton from "@/components/buttons/LogoutButton.vue";
import ThemeSwitcher from "@/components/switcher/ThemeSwitcher.vue";

import { useAuthStore } from "@/stores/auth-store";
import { ref } from "vue";

const { isLoggedIn } = useAuthStore();
const loggedInValue = ref(isLoggedIn);
</script>

<style scoped>
.items {
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>
