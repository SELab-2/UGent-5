<template>
    <v-icon
        color="white"
        :size="size"
    >
        {{ isInstructor ? 'mdi-account-tie' : 'mdi-school'}}
    </v-icon>
</template>

<script setup lang="ts">

defineProps<{
    isInstructor: boolean;
    size: string;
}>();

</script>

<style scoped>

</style>
