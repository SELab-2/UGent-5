<template>
    <router-link :to="destination">
        <v-btn class="group-button" prepend-icon="mdi-arrow-left">
            {{ $t(title) }}
        </v-btn>
    </router-link>
</template>

<script setup lang="ts">
const props = defineProps<{
    destination: String;
    title: String;
}>();

const destination = props.destination
const title = props.title

</script>

<style scoped>

.v-btn {
    margin-bottom: 5px;
    min-width: 150px;
    background-color: rgb(var(--v-theme-primary));
    color: rgb(var(--v-theme-navtext));
}
</style>
