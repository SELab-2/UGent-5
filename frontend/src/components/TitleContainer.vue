<template>
    <v-card class="title-card" variant="flat" color="primary">
        <v-card-title class="title"> {{ title }}</v-card-title>
        <slot></slot>
    </v-card>
</template>

<script setup lang="ts">

const props = defineProps<{
    title: string;
}>();

</script>

<style scoped>

.title-card {
    padding: 30px;
    color: white;
}
.title-card:after {
    content: "";
    background: url("@/assets/ugent_background.png") no-repeat center center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    opacity: 0.4;
}

.title {
    font-size: 32px;
    margin-bottom: 12px;
}

</style>
