<template>
    <v-btn :href="`mailto:${email}`" prepend-icon="mdi-email">
        {{ $t("project.needhelp_button") }}
    </v-btn>
</template>

<script setup lang="ts">
defineProps<{
    email: string;
}>();
</script>

<style scoped></style>
