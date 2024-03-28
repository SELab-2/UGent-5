<template>
    <v-navigation-drawer>
        <div class="logo">
            <img alt="Logo" class="logo" src="@/assets/logo_white_transparant.png" height="60" />
        </div>
        <HomeScreenNavButton v-for="nav in navigations"
            :iconname="nav.icon"
            :title="nav.title"
        />
        <div class="ugent-logo">
            <img
                alt="Logo"
                class="logo"
                src="@/assets/universiteit-gent-logo-white.png"
                height="150"
            />
        </div>
        <LocaleSwitcher class="navSwitcher"/>
    </v-navigation-drawer>
</template>

<script setup lang="ts">
import HomeScreenNavButton from "./HomeScreenNavButton.vue"
import LocaleSwitcher from "../LocaleSwitcher.vue"
const props = defineProps({
    navigations: {}
})


</script>

<style scoped>

.v-navigation-drawer {
    background: linear-gradient(#0e2057, #1e46bd);
}

.logo {
    margin: 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.ugent-logo {
    position: absolute;
    bottom: 0;
    margin-bottom: 30px;
}

.navSwitcher {
    position: absolute;
    bottom: 0;
    left: 10%;
    margin: 10px;
}
</style>
