<template>
    <v-navigation-drawer v-model="isOpen" app>
        <NavButton
            v-for="nav in navigations"
            :key="nav.title"
            :title="nav.title"
            :icon="nav.icon"
            :goto="nav.goto"
        />
        <template v-slot:append>
            <div class="ugent-logo">
                <img
                    alt="Logo"
                    class="logo"
                    src="@/assets/universiteit-gent-logo-white.png"
                    height="150"
                />
            </div>
        </template>
    </v-navigation-drawer>
</template>

<script setup lang="ts">
import NavButton from "./NavButton.vue";
import { ref } from "vue";

interface NavigationData {
    icon: string;
    title: string;
    goto: string;
}

const isOpen = ref(true);

defineProps<{
    navigations: NavigationData[];
}>();

function toggleNav() {
    isOpen.value = !isOpen.value;
}

defineExpose({
    toggleNav,
});
</script>

<style scoped>
.v-navigation-drawer {
    background: linear-gradient(var(--color-primary), #0e2057);
    padding: 10px;
}

.ugent-logo {
    bottom: 0;
    margin-bottom: 30px;
}
</style>
