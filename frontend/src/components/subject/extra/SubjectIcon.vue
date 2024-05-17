<template>
    <v-icon color="white" :size="size">
        {{ role === "instructor" ? "mdi-account-tie" : "mdi-school" }}
    </v-icon>
</template>

<script setup lang="ts">
import { type SubjectRole } from "@/models/Subject";

defineProps<{
    role: SubjectRole;
    size: string;
}>();
</script>

<style scoped></style>
