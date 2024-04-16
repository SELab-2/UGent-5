<template>
    <v-menu transition="slide-y-transition">
        <template v-slot:activator="{ props }">
            <v-btn v-bind="props" class="menu">
                <v-icon class="mdi mdi-dots-vertical"></v-icon>
            </v-btn>
        </template>
        <DropDownList />
    </v-menu>
</template>

<script setup lang="ts">
import DropDownList from "@/components/navigation/DropDownList.vue";
</script>

<style scoped>
.menu {
    margin-right: 10px;
    font-size: 18px;
}
</style>
