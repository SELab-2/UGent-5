<template>
    <div class="page-container">
        <div class="login">
            <img
                alt="white logo"
                class="logo"
                src="@/assets/logo_white_ transparant.png"
                height="100"
            />
            <h3>{{ $t("login.about") }}</h3>
            <a class="login-button" :href="useCASUrl().CASUrl">{{ $t("login.login") }}</a>
            <img
                alt="ugent logo"
                class="ugent-logo"
                src="@/assets/universiteit-gent-logo-white.png"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useCASUrl } from "@/stores/cas-url";
</script>

<style scoped>
.login {
    width: 100%;
    height: 100vh;
    background-color: var(--color-primary);
    /* transform: translateY(-50%); */
    justify-content: center;
    align-items: center;
    flex-direction: column;
    text-align: center;
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
</style>
