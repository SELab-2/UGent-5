<template>
    <v-text-field
        :loading="searchLoading"
        v-model="search"
        :label="$t('default.search')"
        :placeholder="$t('create_subject.search_for_instructors')"
        prepend-inner-icon="mdi-magnify"
        clearable
        single-line
        hide-details
        variant="outlined"
        @click:prepend-inner="onSearchIconClicked"
        @keydown.enter="onSearchIconClicked"
    ></v-text-field>

    <div class="scrollable-list">
        <p v-if="shownUsers.length === 0">No results found</p>
        <v-list v-else>
            <v-list-item v-for="(user, index) in shownUsers" :key="index">
                <v-row>
                    <v-col>
                        <v-list-item-title>
                            {{ user.given_name }} {{ user.surname }}
                        </v-list-item-title>
                    </v-col>
                    <v-col>
                        <v-btn
                            @click="$emit('add-instructor', user)"
                            color="primary"
                            :disabled="userIsInstructor(user)"
                        >
                            {{ $t("default.add") }}
                        </v-btn>
                    </v-col>
                </v-row>
            </v-list-item>
        </v-list>
    </div>
</template>

<script setup lang="ts">
import { useUsersQuery } from "@/queries/User";
import { computed, ref, toRefs } from "vue";
import type User from "@/models/User";

const props = defineProps<{
    instructors: User[];
    currentUser: User;
}>();

const { instructors, currentUser } = toRefs(props);

const { data: users } = useUsersQuery();

const search = ref("");
const searchLoading = ref(false);
const searchLoaded = ref(false);

const shownUsers = computed(() => {
    if (!search.value) {
        return [];
    }
    return [...(users.value || [])]
        .sort((a: User, b: User) => {
            return a.surname.localeCompare(b.surname);
        })
        .filter((user: User) => {
            return (
                user?.uid !== currentUser.value?.uid &&
                `${user?.given_name} ${user.surname}`
                    .toLowerCase()
                    .includes(search.value.toLowerCase())
            );
        });
});

defineEmits<{
    (e: "add-instructor", user: User): void;
}>();

const onSearchIconClicked = () => {
    searchLoading.value = true;
    setTimeout(() => {
        searchLoaded.value = true;
        searchLoading.value = false;
    }, 1000);
};

const userIsInstructor = (user: User) => {
    return instructors.value.some((instructor: User) => instructor?.uid === user?.uid);
};
</script>

<style scoped>
.scrollable-list {
    overflow-y: auto;
    max-height: 200px;
    scrollbar-width: none;
}

.scrollable-list::-webkit-scrollbar {
    width: 0; /* For Chrome, Safari, and Opera */
}
</style>
