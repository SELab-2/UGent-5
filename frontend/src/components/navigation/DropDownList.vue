<template>
    <v-list class="items bg-primary">
        <v-list-item data-test="logoutButton" v-if="loggedInValue.value">
            <LogoutButton />
        </v-list-item>
        <v-list-item data-test="localeSwitcher">
            <LocaleSwitcher />
        </v-list-item>
    </v-list>
</template>

<script setup lang="ts">
import LocaleSwitcher from "@/components/switcher/LocaleSwitcher.vue";
import LogoutButton from "@/components/buttons/LogoutButton.vue";

import { useAuthStore } from "@/stores/auth-store";
import { storeToRefs } from "pinia";
import { ref } from "vue";

const loggedInValue = ref(false);

const beforeCreate = async function beforeCreate() {
    const { isLoggedIn } = storeToRefs(useAuthStore());
    loggedInValue.value = isLoggedIn;
};

beforeCreate();
</script>

<style scoped>
.items {
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>
