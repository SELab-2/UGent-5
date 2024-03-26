<template>
    <v-navigation-drawer>
        <div class="logo">
            <img alt="Logo" class="logo" src="@/assets/logo_white_ transparant.png" height="60"/>
        </div>
        <v-list-item link title="List Item 1"></v-list-item>
        <v-list-item link title="List Item 2"></v-list-item>
        <v-list-item link title="List Item 3"></v-list-item>
    </v-navigation-drawer>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth-store";
import { ref, onMounted } from "vue";
const apiUrl = import.meta.env.VITE_API_URL;
const user = ref<string | null>(null);
const { token, logout } = useAuthStore();
onMounted(async () => {
    await fetchUser();
});

async function fetchUser() {
    if (!token) {
        return;
    }
    await fetch(`${apiUrl}/api/users/me`, {
        headers: { Authorization: `${token?.token_type} ${token?.token}` },
    })
        .then((data) => data.json())
        .then((userObj) => {
            user.value = userObj.given_name;
        })
        .catch((error) => console.log(error));
}
</script>

<style scoped lang="scss">
.v-navigation-drawer {
    background: linear-gradient(#0e2057, #1e46bd);
    align-content: center;
}
.logo {
    margin: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
</style>
