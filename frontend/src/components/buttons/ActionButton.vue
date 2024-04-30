<template>
    <v-btn :prepend-icon="prependIcon">
        {{ title }}
    </v-btn>
</template>


<script setup lang="ts">

defineProps<{
    title: string;
    prependIcon: string;
}>();

</script>



<style scoped>

</style>
