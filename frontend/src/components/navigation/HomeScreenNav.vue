<template>
    <div>
        <HomeScreenNavButton
            v-for="nav in navigations"
            :key="nav.title"
            :iconname="nav.icon"
            :title="nav.title"
            :goTo="nav.goTo"
        />
        <div class="ugent-logo">
            <img
                alt="Logo"
                class="logo"
                src="@/assets/universiteit-gent-logo-white.png"
                height="150"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import HomeScreenNavButton from "./HomeScreenNavButton.vue";

interface Navigation {
    title: string;
    icon: string;
    goTo?: string;
}

defineProps<{
    navigations: Navigation[];
}>();
</script>

<style scoped>
.v-navigation-drawer {
    background: linear-gradient(var(--color-primary), #0e2057);
    padding: 10px;
}

.ugent-logo {
    position: absolute;
    bottom: 0;
    margin-bottom: 30px;
}
</style>
