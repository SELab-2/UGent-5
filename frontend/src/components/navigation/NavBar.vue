<template>
    <v-navigation-drawer v-model="isOpen" app class="text-background">
        <div class="navbuttons">
            <NavButton
                v-for="nav in navigations"
                :key="nav.title"
                :title="nav.title"
                :icon="nav.icon"
                :goto="nav.goto"
            />
        </div>
        <template v-slot:append>
            <UgentLogo />
        </template>
    </v-navigation-drawer>
</template>

<script setup lang="ts">
import NavButton from "@/components/navigation/NavButton.vue";
import { ref } from "vue";
import useNavigations from "@/composables/useNavigations";
import UgentLogo from "@/components/navigation/UgentLogo.vue";

const { navigations } = useNavigations();

const isOpen = ref(true);

function toggleNav() {
    isOpen.value = !isOpen.value;
}

defineExpose({
    toggleNav,
});
</script>

<style scoped lang="scss">
.v-navigation-drawer {
    background: rgb(var(--v-theme-primary));
    padding: 10px;
}

.ugent-logo {
    bottom: 0;
}

.navbuttons {
    margin-top: 20px;
}
</style>
