<template>
    <div class="v-container">
        <h1>My Courses</h1>

        <div v-if="isLoading" class="v-container">
            <p>Loading...</p>
        </div>

        <div v-else-if="isError" class="v-container">
            <p>Error: {{error}}</p>
        </div>

        <div
            class="v-container"
            v-else-if="data"
        >
            <ul class="pa-5">
                <li
                    v-for="subject in data?.subjects"
                    :key="subject.id"
                >
                    <router-link :to="{ name: 'subject', params: { subjectId: subject.id }}">
                        {{ subject.name }}
                    </router-link>
                </li>

            </ul>
        </div>


    </div>
</template>

<script setup lang="ts">

import {useSubjectsQuery} from "@/queries/Subject";

const {data, error, isLoading, isError} = useSubjectsQuery()

</script>

<style scoped>

</style>
