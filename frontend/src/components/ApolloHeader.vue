<template>
    <div class="header">
        <RouterLink to="/">
            <img alt="Logo" class="logo" src="@/assets/logo_white_transparant.png" />
        </RouterLink>
        <LocaleSwitcher />
    </div>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
import LocaleSwitcher from "./LocaleSwitcher.vue";
</script>

<style scoped>
.logo {
    max-width: 80%;
    max-height: 70px;
    margin-right: auto;
}

.header {
    padding: 5px 0px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
}
</style>
