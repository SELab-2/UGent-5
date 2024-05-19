<template>
    <v-card variant="text" class="title-card" width="100%">
        <v-card-title class="card-title">
            Add instructors to subject
        </v-card-title>
        <v-card-text>
            <UserSearchList current-user="" instructors="">

            </UserSearchList>
        </v-card-text>
    </v-card>
</template>


<script setup lang="ts">

import UserSearchList from "@/components/subject/createSubjectView/body/UserSearchList.vue";
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
