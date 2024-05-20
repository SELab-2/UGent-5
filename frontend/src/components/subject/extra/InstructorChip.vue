<template>
    <v-chip
        v-for="instructor in instructors"
        :key="instructor!.uid"
        :closable="closable"
        variant="elevated"
        :color="instructor!.is_teacher ? `primary` : `green`"
        @click:close="$emit('remove-instructor', instructor)"
        class="ma-1"
    >
        <v-icon
            :icon="instructor!.is_teacher ? `mdi-account-tie-outline` : `mdi-school`"
            start
        ></v-icon>
        {{ instructor.given_name[0] }}. {{ instructor.surname }}
    </v-chip>
</template>


<script setup lang="ts">

import type User from "@/models/User";

defineProps<{
    instructors: User[];
    closable: boolean;
}>();

</script>

<style scoped>

</style>
