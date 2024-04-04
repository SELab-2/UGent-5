<template>
    <v-menu transition="slide-y-transition">
        <template v-slot:activator="{ props }">
            <v-btn v-bind="props" class="menu">
                <icon class="mdi mdi-dots-vertical"></icon>
            </v-btn>
        </template>
        <v-list class="items">
            <v-list-item>
                <LogoutButton />
            </v-list-item>
            <v-list-item>
                <LocaleSwitcher />
            </v-list-item>
        </v-list>
    </v-menu>
</template>

<script setup lang="ts">
import LocaleSwitcher from "@/components/LocaleSwitcher.vue"
import LogoutButton from "@/components/buttons/LogoutButton.vue"

</script>

<style scoped>
.menu {
    margin-right: 10px;
    font-size: 18px;
}

.items {
    display: flex;
    flex-direction: column;
    align-items: center;
}

</style>
