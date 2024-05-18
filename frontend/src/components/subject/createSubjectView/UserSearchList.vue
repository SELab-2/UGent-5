<template>
    <v-card title="Instructors" flat>
        <v-card-text>
            <v-text-field
                :loading="searchLoading"
                v-model="search"
                label="Search"
                placeholder="Search for instructors"
                prepend-inner-icon="mdi-magnify"
                clearable
                single-line
                hide-details
                @click:prepend-inner="onSearchIconClicked"
                @keydown.enter="onSearchIconClicked"
            ></v-text-field>
        </v-card-text>

        <div v-show="searchLoaded">
            <p v-if="shownUsers.length === 0">No results found</p>
            <v-list v-else>
                <v-list-item
                    v-for="(user, index) in shownUsers"
                    :key="index"
                >
                    <v-list-item-title>
                        {{ user.given_name }} {{ user.surname }}
                    </v-list-item-title>
                    <v-btn
                        @click="onAddInstructorButtonClicked(user)"
                        color="primary"
                        :disabled="userIsInstructor(user)"
                    >
                        Add
                    </v-btn>
                </v-list-item>
            </v-list>
        </div>


    </v-card>
</template>

<script setup lang="ts">

import {useUsersQuery} from "@/queries/User";
import {computed, ref, toRefs} from "vue";
import type User from "@/models/User";

const props = defineProps<{
    instructors: User[];
    currentUser: User;
}>();

const {instructors, currentUser} = toRefs(props);

const {data: users, isLoading, isError} = useUsersQuery();

const search = ref("");
const searchLoading = ref(false);
const searchLoaded = ref(false);
const shownUsers = ref([]);

const filteredUsers = computed(() => {
    if (!search.value) {
        return [];
    }
    return [...(users.value || [])].filter((user: User) => {
        return (
            user?.uid !== currentUser.value?.uid &&
            `${user?.given_name} ${user.surname}`.toLowerCase().includes(search.value.toLowerCase())
        );
    }).slice(0, 5);
});

const emit = defineEmits<{
    (e: "add-instructor", user: User): void;
}>();

const onSearchIconClicked = () => {
    searchLoading.value = true;
    setTimeout(() => {
        searchLoaded.value = true;
        searchLoading.value = false;
        shownUsers.value = filteredUsers.value;
    }, 1000);
};

const onAddInstructorButtonClicked = (user: User) => {
    emit("add-instructor", user);
};

const userIsInstructor = (user: User) => {
    return instructors.value.some((instructor: User) => instructor?.uid === user?.uid);
};


</script>

<style scoped>

</style>
