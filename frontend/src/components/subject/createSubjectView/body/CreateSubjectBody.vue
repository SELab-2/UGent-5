<template>
    <v-row>
        <v-col cols="4">
            <SubjectInstructorsCard
                :instructors="instructors"
            ></SubjectInstructorsCard>
        </v-col>
        <v-col cols="8">
            <UserSearchCard
                :current-user="currentUser"
                :instructors="instructors"
                @add-instructor="addInstructor"
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

const emit = defineEmits<{
    (e: "add-instructor", user: User): void;
}>();

const addInstructor = (user: User) => {
    emit("add-instructor", user);
};

</script>

<style scoped>

</style>
