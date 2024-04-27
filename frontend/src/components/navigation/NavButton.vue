<template>
    <v-list-item :data-test="title">
        <v-btn variant="text" class="btn-wrapper" :to="{ name: goto }">
            <v-icon :icon="icon" />
            <span>{{ $t(title) }}</span>
            <v-icon class="chevron" icon="mdi-chevron-right" />
        </v-btn>
    </v-list-item>
</template>

<script setup lang="ts">
defineProps<{
    icon: string;
    title: string;
    goto: string;
}>();
</script>

<style scoped>
.btn-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    color: rgb(var(--v-theme-secondary));
    text-transform: capitalize;


}

.v-icon {
    margin-right: 10px;
}

.chevron {
    position: absolute;
    right: 0;
}
</style>
