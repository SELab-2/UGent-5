<template>
    <v-card variant="text" class="title-card" width="100%" height="350px">
        <v-card-title class="card-title">
            {{ $t("create_subject.search_for_instructors") }}
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
import UserSearchList from "@/components/subject/modify/body/UserSearchList.vue";
import type User from "@/models/User";

defineProps<{
    currentUser: User;
    instructors: User[];
}>();

defineEmits<{
    (e: "add-instructor", user: User): void;
}>();
</script>

<style scoped>
.title-card {
    background-color: rgb(var(--v-theme-secondary));
    padding: 20px;
}

.card-title {
    font-size: 24px;
    text-transform: capitalize;
    display: block;
    line-height: 1.2;
    font-weight: 500;
}
</style>
