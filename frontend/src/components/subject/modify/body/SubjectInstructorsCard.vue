<template>
    <v-card variant="text" width="100%" class="title-card" height="100%">
        <v-card-title class="card-title">
            {{ $t("create_subject.subject_instructors") }}
        </v-card-title>
        <v-card-text>
            <v-chip
                v-for="instructor in instructors"
                :key="instructor!.uid"
                closable
                variant="elevated"
                :color="instructor!.is_teacher ? `primary` : `green`"
                @click:close="$emit('remove-instructor', instructor)"
                class="ma-1 chip"
            >
                <v-icon
                    :icon="instructor!.is_teacher ? `mdi-account-tie-outline` : `mdi-school`"
                    start
                ></v-icon>
                {{ instructor.given_name[0] }}. {{ instructor.surname }}
            </v-chip>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import type User from "@/models/User";

defineProps<{
    instructors: User[];
}>();

defineEmits<{
    (e: "remove-instructor", user: User): void;
}>();
</script>

<style scoped>
.title-card {
    background-color: rgb(var(--v-theme-secondary));
    padding: 20px;
}

.chip {
    min-width: fit-content;
}

.card-title {
    font-size: 24px;
    text-transform: capitalize;
    display: block;
    line-height: 1.2;
    font-weight: 500;
    word-wrap: break-word;
    white-space: normal;
    overflow: hidden;
}
</style>
