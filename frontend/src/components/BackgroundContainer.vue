<template>
    <div class="content">
        <slot></slot>
    </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.content {
    padding: 20px;
    height: 100vh;
    border: 25px solid white;
    border-radius: 50px;
    background-color: var(--color-secondary);
}
</style>
