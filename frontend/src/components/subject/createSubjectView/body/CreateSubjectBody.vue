<template>
    <v-row class="body">
        <v-col cols="4">
            <SubjectInstructorsCard
                :instructors="instructors"
                @remove-instructor="$emit('remove-instructor', $event)"
            ></SubjectInstructorsCard>
        </v-col>
        <v-col cols="8">
            <UserSearchCard
                :current-user="currentUser"
                :instructors="instructors"
                @add-instructor="$emit('add-instructor', $event)"
            ></UserSearchCard>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import SubjectInstructorsCard from "@/components/subject/createSubjectView/body/SubjectInstructorsCard.vue";
import type User from "@/models/User";
import UserSearchCard from "@/components/subject/createSubjectView/body/UserSearchCard.vue";

defineProps<{
    currentUser: User;
    instructors: User[];
}>();

defineEmits<{
    (e: "add-instructor", user: User): void;
    (e: "remove-instructor", user: User): void;
}>();
</script>

<style scoped></style>
