<template>
    <v-app-bar class="bg-primary elevation-1">
        <v-app-bar-nav-icon variant="text" @click="emit('toggleNav')"></v-app-bar-nav-icon>
        <RouterLink to="/">
            <img alt="Logo" class="logo" src="@/assets/logo_white_transparant.png" />
        </RouterLink>
        <div class="leftContent" v-if="smAndDown">
            <DropDownMobile />
        </div>
        <div class="leftContent" v-else>
            <LogoutButton class="logout" v-if="isLoggedIn" />
            <LocaleSwitcher />
            <ThemeSwitcher class="switcher"/>
        </div>
    </v-app-bar>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
import { useDisplay } from "vuetify";
import LocaleSwitcher from "./switcher/LocaleSwitcher.vue";
import DropDownMobile from "@/components/navigation/DropDownMobile.vue";
import ThemeSwitcher from "@/components/switcher/ThemeSwitcher.vue"
import LogoutButton from "@/components/buttons/LogoutButton.vue";
import { useAuthStore } from "@/stores/auth-store";
import { storeToRefs } from "pinia";

const { smAndDown } = useDisplay();

const emit = defineEmits<{
    (e: "toggleNav"): void;
}>();

const { isLoggedIn } = storeToRefs(useAuthStore());
</script>

<style scoped>
.logo {
    max-height: 50px;
    margin-right: auto;
}

.v-app-bar {
    padding: 5px 0;
}

.v-app-bar-nav-icon{
    color: rgb(var(--v-theme-secondary));
}

.leftContent {
    margin-left: auto;
    display: flex;
    align-items: center;
}

.logout {
    color: rgb(var(--v-theme-secondary));
}

.switcher{
    margin-left: 20px;
}
</style>
