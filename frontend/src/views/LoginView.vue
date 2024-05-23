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
            <UgentLogo class="ugent-logo" />
            <LocaleSwitcher class="login-switcher" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useCASUrl } from "@/stores/cas-url";
import LocaleSwitcher from "@/components/switcher/LocaleSwitcher.vue";
import UgentLogo from "@/components/navigation/UgentLogo.vue";
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
    background: linear-gradient(rgb(var(--v-theme-primary)), #0e2057);
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
    background-color: rgba(225, 225, 225, 0.1);
    color: var(--white);
    text-decoration: none;
    border: 1px solid var(--color-border);
    padding: 10px 20px;
    font-size: 16px;
    border-radius: 15px;
    cursor: pointer;
    transition:
        background-color 0.3s,
        color 0.3s;
}

.login-button:hover {
    background-color: rgba(225, 225, 225, 0.2);
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
