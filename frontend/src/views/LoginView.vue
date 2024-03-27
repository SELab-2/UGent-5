<template>
    <div class="page-container">
        <div class="login">
            <img
                alt="white logo"
                class="logo"
                src="@/assets/logo_white_transparant.png"
                height="100"
            />
            <h3>{{ $t("login.about") }}</h3>
            <a class="login-button" :href="useCASUrl().CASUrl">{{ $t("login.login") }}</a>
            <img
                alt="ugent logo"
                class="ugent-logo"
                src="@/assets/universiteit-gent-logo-white.png"
            />
            <LocaleSwitcher class="login-switcher" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useCASUrl } from "@/stores/cas-url";
import LocaleSwitcher from "@/components/LocaleSwitcher.vue";
</script>

<style scoped>
.page-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

.login {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: var(--color-primary);
    height: 100%;
}

.logo {
    margin-top: 125px;
}

.login h1,
.login h2,
.login h3 {
    color: white;
    margin-bottom: 100px;
}

.login p {
    color: white;
    font-size: 20px;
    margin-bottom: 20px;
}

.login-button {
    background-color: var(--gray-4);
    color: var(--white);
    border: 2px solid var(--color-border);
    padding: 10px 20px;
    font-size: 16px;
    border-radius: 50px;
    cursor: pointer;
    transition:
        background-color 0.3s,
        color 0.3s;
}

.login-button:hover {
    background-color: var(--gray-3);
    color: var(--white);
}

.ugent-logo {
    position: absolute;
    bottom: 5px;
    left: 5px;
    height: 150px;
    width: auto;
}

.login-switcher {
    margin-top: auto;
}

.login-switcher {
    margin-bottom: 20px;
}
</style>
