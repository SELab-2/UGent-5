<template>
    <h2 v-if="isLoading" class="welcome">Loading...</h2>
    <h2 v-else-if="isError" class="welcome">Error!!!</h2>
    <div v-else class="userInfo">
        <UserInfo :user="user!" @toggle-admin="onToggleAdmin" />
        <button class="logout-button" @click="logout">{{ $t("home.logout") }}</button>
    </div>
</template>

<script setup lang="ts">
import UserInfo from "@/components/user/UserInfo.vue";
import { useAuthStore } from "@/stores/auth-store";
import { useUserQuery, useToggleAdminMutation } from "@/queries/User";

const { data: user, isLoading, isError } = useUserQuery(null);
const { mutateAsync } = useToggleAdminMutation();
const { logout } = useAuthStore();

function onToggleAdmin() {
    mutateAsync(user.value!);
}
</script>

<style scoped lang="scss">
.userInfo {
    justify-content: center;
    align-items: center;
    flex-direction: column;
    text-align: center;
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
