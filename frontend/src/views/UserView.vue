<template>
    <div class="userInfo">
        <Suspense>
            <div>
                <UserInfo />
                <button class="logout-button" @click="logout">{{ $t("home.logout") }}</button>
            </div>
            <template #fallback>
                Loading...
            </template>
        </Suspense>
    </div>
</template>

<script setup lang="ts">
import UserInfo from "@/components/user/UserInfo.vue";
import { useAuthStore } from "@/stores/auth-store";

const { logout } = useAuthStore();
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
