<template>
    <div class="adminpanel">
        <v-card :title="$t('admin.users')" flat>
            <v-card-title>
                <v-text-field
                    :loading="searchLoading"
                    prepend-inner-icon="mdi-magnify"
                    :label="$t('admin.search')"
                    single-line
                    hide-details
                    @update:model-value="onSearch"
                ></v-text-field>
            </v-card-title>
            <SearchTable :search="search" :users="users || []" />
        </v-card>
    </div>
</template>
<script setup lang="ts">
import SearchTable from "@/components/user/SearchTable.vue";
import { useUsersQuery } from "@/queries/User";
import { throttle } from "@/utils";
import { ref } from "vue";

const search = ref("");
const searchLoading = ref(false);

const { data: users } = useUsersQuery();

function setSearch(value: string) {
    search.value = value;
    searchLoading.value = false;
}

const throttledSetSearch = throttle(setSearch, 500);

function onSearch(value: string) {
    searchLoading.value = true;
    throttledSetSearch(value);
}
</script>
<style scoped>
.adminpanel {
    margin: 15px;
}

.table {
    padding: 15px;
}
</style>
