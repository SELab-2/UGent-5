<template>
    <router-link :to="{ name: 'subject', params: { subjectId: subject.id } }" class="router-link">
        <v-card rounded="xl" class="subject-card" width="50%">
            <v-skeleton-loader :loading="isLoading">
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
            </v-skeleton-loader>
        </v-card>
    </router-link>
</template>

<script setup lang="ts">
import Subject from "@/models/Subject";

defineProps<{
    subject: Subject | undefined;
    isLoading: boolean | undefined;
}>();
</script>

<style scoped>
.router-link {
    text-decoration: none;
}

.subject-card {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    margin-top: 10px;
}
</style>
