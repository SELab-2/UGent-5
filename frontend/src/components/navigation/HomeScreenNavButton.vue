<template>
    <v-list-item>
        <v-btn variant="text" class="btn-wrapper" :to="{ name: goTo }">
            <v-icon :icon="iconname" />
            <span>{{ $t(title) }}</span>
            <v-icon class="chevron" icon="mdi-chevron-right" />
        </v-btn>
    </v-list-item>
</template>

<script setup lang="ts">

const props = defineProps({
    iconname: String,
    title: String,
    goTo: {type: String, default: "about" }
})

</script>

<style scoped>
.btn-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

.v-icon {
    margin-right: 10px;
}

.chevron {
    position: absolute;
    right: 0;
}
</style>
