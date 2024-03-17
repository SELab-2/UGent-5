<template>
    <div class="logout" :v-if="user">
        <h2>{{ $t("home.welcome", { name: user }) }}!</h2>
        <button class="logout-button" @click="logout">Logout</button>
    </div>
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
.logout {
    justify-content: center;
    align-items: center;
    flex-direction: column;
    text-align: center;
}

.logout h2 {
    margin-top: 50px;
    margin-bottom: 30px;
}

.logout-button {
    background-color: var(--color-error);
    color: var(--color-text-on-error);
    border: 2px solid var(--white);
    padding: 10px 20px;
    font-size: 16px;
    border-radius: 50px;
    cursor: pointer;
    transition:
        background-color 0.3s,
        color 0.3s;
}

.logout-button:hover {
    background-color: indianred;
    color: white;
}
</style>
