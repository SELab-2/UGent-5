<template>
    <v-card variant="text" width="100%" class="title-card">
        <v-card-title class="card-title">
            Subject instructors
        </v-card-title>
        <v-card-text>
            <v-chip
                v-for="instructor in instructors"
                :key="instructor!.uid"
                closable
                variant="elevated"
                :color="instructor!.is_teacher ? `primary` : `green` "
                @click:close="$emit('remove-instructor', instructor)"
            >
                <v-icon
                    :icon="instructor!.is_teacher ? `mdi-account-tie-outline` : `mdi-school` "
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

const emit = defineEmits<{
    (e: "remove-instructor", user: User): void;
}>();

</script>



<style scoped>

.title-card {
    background-color: white;
    padding: 20px;
}

.card-title {
    font-size: 24px;
    text-transform: capitalize;
    display: block;
    line-height: 1.2;
    font-weight: 500;
    color: black;
}



</style>
