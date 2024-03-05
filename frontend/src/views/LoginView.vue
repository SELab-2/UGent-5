<template>
    <div class="page-container">
        <div class="login">
            <img
                alt="white logo"
                class="logo"
                src="@/assets/logo_white_ transparant.png"
                height="100"
            />
            <h3>De officiële indienapplicatie van de Universiteit Gent</h3>
            <p>Aanmelden</p>
            <a class="login-button" :href="apiUrl + '/login'">Apollo login </a>
            <img
                alt="ugent logo"
                class="ugent-logo"
                src="@/assets/universiteit-gent-logo-white.png"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
const apiUrl = import.meta.env.VITE_API_URL;
</script>

<style scoped>
.page-container {
    background-color: green;
}

.login {
    --primary-bg-color: #1d357e;
    --secondary-bg-color: #797d7f;
    --tertiary-bg-color: #a6acaf;
    position: fixed;
    top: 50%;
    left: 0;
    width: 100%;
    height: 75vh;
    background-color: var(--primary-bg-color);
    transform: translateY(-50%);
    justify-content: center;
    align-items: center;
    flex-direction: column;
    text-align: center;
}

.logo {
    margin-top: 30px;
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
    background-color: var(--secondary-bg-color);
    color: white;
    border: 2px solid white;
    padding: 10px 20px;
    font-size: 16px;
    border-radius: 50px;
    cursor: pointer;
    transition:
        background-color 0.3s,
        color 0.3s;
}

.login-button:hover {
    background-color: var(--tertiary-bg-color);
    color: white;
}

.ugent-logo {
    position: absolute;
    bottom: 5px;
    left: 5px;
    height: 150px;
    width: auto;
}
</style>
