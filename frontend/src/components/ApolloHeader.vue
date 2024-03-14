<template>
    <header>
        <RouterLink to="/">
            <img alt="Logo" class="logo" src="@/assets/logo_white_ transparant.png" />
        </RouterLink>
    </header>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<style scoped>
.logo {
    max-width: 80%;
    max-height: 70px;
    margin-right: auto;
}

header {
    background-color: var(--color-primary);
    padding: 5px 0px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
}
</style>
