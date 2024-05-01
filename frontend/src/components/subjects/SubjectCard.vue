<template>
    <v-skeleton-loader type="card" class="card-loader">
        <router-link
            :to="{ name: 'subject', params: { subjectId: subject.id } }"
            class="router-link"
        >
            <v-card rounded="xl" class="subject-card">
                <v-img
                    src="https://cdn.vuetifyjs.com/images/cards/desert.jpg"
                    class="align-end"
                    gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                    cover
                    aspect-ratio="16/9"
                    height="120px"
                >
                    <v-card-title>
                        {{ subject?.name }}
                        <v-icon class="">mdi-chevron-right</v-icon>
                    </v-card-title>
                </v-img>
            </v-card>
        </router-link>
    </v-skeleton-loader>
</template>

<script setup lang="ts">
import type Subject from "@/models/Subject";

defineProps<{
    subject: Subject;
    isLoading: boolean;
}>();
</script>

<style scoped>
.card-loader {
    border-radius: 25px;
}

.router-link {
    text-decoration: none;
    width: 100%;
}

.subject-card {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    width: 100%;
}
</style>
