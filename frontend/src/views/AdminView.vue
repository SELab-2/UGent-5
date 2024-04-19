<template>
    <div class="adminpanel">
        <v-card :title="$t('admin.users')" flat class="bg-white">
            <v-card-title>
                <v-text-field
                    prepend-inner-icon="mdi-magnify"
                    v-model="search"
                    label="Search"
                    single-line
                    hide-details
                ></v-text-field>
            </v-card-title>
            <v-data-table-virtual
                :headers="headers"
                :items="users"
                :search="search"
                v-model:sortBy="sortBy"
                item-value="uid"
                :loading="isUserLoading || isUsersLoading"
                density="compact"
                class="table"
            >
                <template v-slot:loading>
                    <v-skeleton-loader type="table-row@15" class="table"></v-skeleton-loader>
                </template>
                <template v-slot:[`item.is_teacher`]="{ item }">
                    <v-checkbox-btn
                        :model-value="item.is_teacher"
                        :disabled="item.uid === currentUser?.uid"
                        @update:model-value="() => onToggleTeacher(item)"
                    ></v-checkbox-btn>
                </template>
                <template v-slot:[`item.is_admin`]="{ item }">
                    <v-checkbox-btn
                        :model-value="item.is_admin"
                        :disabled="item.uid === currentUser?.uid"
                        @update:model-value="() => onToggleAdmin(item)"
                    ></v-checkbox-btn>
                </template>
            </v-data-table-virtual>
        </v-card>
    </div>
</template>
<script setup lang="ts">
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import {
    useUserQuery,
    useUsersQuery,
    useToggleAdminMutation,
    useToggleTeacherMutation,
} from "@/queries/User";
import type User from "@/models/User";

const { t } = useI18n();

const { data: currentUser, isLoading: isUserLoading } = useUserQuery(null);
const { data: users, isLoading: isUsersLoading } = useUsersQuery();
const { mutateAsync: toggleAdmin } = useToggleAdminMutation();
const { mutateAsync: toggleTeacher } = useToggleTeacherMutation();

/**
 * Sorts boolean values in descending order.
 */
function sortBool(a: boolean, b: boolean): number {
    return a === b ? 0 : a ? -1 : 1;
}

const search = ref("");
const sortBy = ref([{ key: "given_name", order: "asc" }]);

async function onToggleAdmin(user: User) {
    await toggleAdmin(user.uid);
}

async function onToggleTeacher(user: User) {
    await toggleTeacher(user.uid);
}

const headers = ref([
    {
        title: computed(() => t("admin.userTable.name")),
        key: "given_name",
        align: "start",
        sortable: true,
    },
    {
        title: computed(() => t("admin.userTable.uid")),
        key: "uid",
        align: "start",
        sortable: false,
    },
    {
        title: computed(() => t("admin.userTable.email")),
        key: "mail",
        align: "start",
        sortable: false,
    },
    {
        title: computed(() => t("admin.userTable.isTeacher")),
        key: "is_teacher",
        sortable: true,
        filterable: false,
        filter: () => true, // disable filter
        sort: sortBool,
    },
    {
        title: computed(() => t("admin.userTable.isAdmin")),
        key: "is_admin",
        sortable: true,
        filterable: false,
        filter: () => true, // disable filter
        sort: sortBool,
    },
]);
</script>
<style scoped>
.adminpanel {
    margin: 15px;
}

.table {
    color: black !important;
    background-color: white;
    width: 95%;
}
</style>
