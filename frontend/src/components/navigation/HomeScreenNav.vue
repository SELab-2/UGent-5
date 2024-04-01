<template>
    <v-navigation-drawer
    v-model="navOpen" app>
        <HomeScreenNavButton v-for="nav in navigations"
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
    </v-navigation-drawer>
</template>

<script setup lang="ts">
import HomeScreenNavButton from "./HomeScreenNavButton.vue"
import { ref, inject } from 'vue';

const props = defineProps({
    navigations: {}
})

const navOpen = inject('navOpen');

</script>

<style scoped>

.v-navigation-drawer {
    background: linear-gradient(var(--color-primary), #0e2057);
    padding: 10px
}

.ugent-logo {
    position: absolute;
    bottom: 0;
    margin-bottom: 30px;
}

</style>
