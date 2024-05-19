<template>
    <v-card variant="text" class="title-card" width="100%">
        <v-card-title class="card-title">
            Search for instructors
        </v-card-title>
        <v-card-text>
            <UserSearchList
                :current-user="currentUser"
                :instructors="instructors"
                @add-instructor="$emit('add-instructor', $event)"
            >
            </UserSearchList>
        </v-card-text>
    </v-card>
</template>


<script setup lang="ts">
import UserSearchList from "@/components/subject/createSubjectView/body/UserSearchList.vue";
import type User from "@/models/User";

defineProps<{
    currentUser: User;
    instructors: User[];
}>();

const emit = defineEmits<{
    (e: "add-instructor", user: User): void;
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
