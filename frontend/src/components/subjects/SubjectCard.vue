<template>
    <v-card color="white" variant="text" image="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg">
        {{ subjects?.name}}
    </v-card>

</template>

<script setup lang="ts">
import Subject from "@/models/Subject";

defineProps<{
    subjects: Subject | undefined,
}>();


</script>

<style scoped>

</style>
