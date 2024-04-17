<template>
    <div class="adminpanel">
        <v-card :title="$t('admin.users')" flat class="bg-white">
            <v-card-title>
                <v-text-field
                    append-icon="mdi-magnify"
                    v-model="search"
                    label="Search"
                    single-line
                    hide-details
                ></v-text-field>
            </v-card-title>
            <v-data-table :headers="headers" :items="data" :search="search" class="table">
                <template v-slot:[`item.isTeacher`]="{ item }">
                    <v-checkbox v-model="item.isTeacher"></v-checkbox>
                </template>
                <template v-slot:[`item.isAdmin`]="{ item }">
                    <v-checkbox v-model="item.isAdmin"></v-checkbox>
                </template>
            </v-data-table>
        </v-card>
    </div>
</template>
<script setup lang="ts">
import { ref } from "vue";

const search = ref("");
const headers = [
    { key: "name", title: "Name", align: "start", sortable: false },
    { key: "email", title: "Email", sortable: false },
    { key: "isTeacher", title: "isTeacher", sortable: false },
    { key: "isAdmin", title: "isAdmin", sortable: false },
];

const data = ref([
    { id: 0, name: "Albert", email: "albert@Ugent.be", isTeacher: false, isAdmin: false },
    { id: 1, name: "Bert", email: "bert@ugent.be", isTeacher: true, isAdmin: false },
    { id: 2, name: "Cedric", email: "cedrik@ugent.be", isTeacher: false, isAdmin: true },
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
