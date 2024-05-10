<template>
    <v-card variant="flat">
        <v-card-item>
            <v-card-title>
                {{ $t("project.requirements") }}
            </v-card-title>
        </v-card-item>
        <v-card-text>
            <v-card-subtitle>{{ $t("project.mandatory") }}</v-card-subtitle>

            <v-list>
                <v-list-item v-for="req in requirements.filter(r => r.mandatory)" :key="req.value">
                    <v-list-item-title>{{ req.value }}</v-list-item-title>
                </v-list-item>
            </v-list>
            <v-card-subtitle>{{ $t("project.forbidden") }}</v-card-subtitle>
            <v-list>
                <v-list-item v-for="req in requirements.filter(r => !r.mandatory)" :key="req.value">
                    <v-list-item-title>{{ req.value }}</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-card-text>
    </v-card>

</template>

<script setup lang="ts">
import { toRefs } from "vue";
import type { Requirement } from "@/models/Project";

const props = defineProps<{
    requirements: [Requirement];
}>();

const { requirements } = toRefs(props);

</script>

<style scoped>
.v-card, .v-list {
    width: 100%;
    background-color: rgb(var(--v-theme-secondary));
}
</style>
