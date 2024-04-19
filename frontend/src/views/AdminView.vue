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
                :items="data"
                :search="search"
                v-model:sortBy="sortBy"
                item-value="uid"
                :loading="isLoading"
                density="compact"
                class="table"
            >
                <template v-slot:loading>
                    <v-skeleton-loader type="table-row@15" class="table"></v-skeleton-loader>
                </template>
                <template v-slot:[`item.isTeacher`]="{ item }">
                    <v-checkbox-btn
                        v-model="item.isTeacher"
                        :disabled="item.uid === currentUser?.uid"
                    ></v-checkbox-btn>
                </template>
                <template v-slot:[`item.isAdmin`]="{ item }">
                    <v-checkbox-btn
                        v-model="item.isAdmin"
                        :disabled="item.uid === currentUser?.uid"
                    ></v-checkbox-btn>
                </template>
            </v-data-table-virtual>
        </v-card>
    </div>
</template>
<script setup lang="ts">
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useUserQuery } from "@/queries/User";

const { t } = useI18n();

const { data: currentUser, isLoading } = useUserQuery(null);

const search = ref("");
const sortBy = ref([{ key: "name", order: "asc" }]);

const headers = ref([
    {
        title: computed(() => t("admin.userTable.name")),
        key: "name",
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
        key: "email",
        align: "start",
        sortable: false,
    },
    {
        title: computed(() => t("admin.userTable.isTeacher")),
        key: "isTeacher",
        sortable: true,
        filterable: false,
        filter: () => true, // disable filter
    },
    {
        title: computed(() => t("admin.userTable.isAdmin")),
        key: "isAdmin",
        sortable: true,
        filterable: false,
        filter: () => true, // disable filter
    },
]);

const data = ref([
    { uid: "brreynie", name: "Bert", email: "bert@ugent.be", isTeacher: false, isAdmin: true },
    { uid: "albe", name: "Albert", email: "albert@Ugent.be", isTeacher: true, isAdmin: false },
    { uid: "cedr", name: "Cedric", email: "cedrik@ugent.be", isTeacher: false, isAdmin: true },
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
