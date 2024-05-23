<template>
    <router-link :to="{ name: 'subject', params: { subjectId: subject.id } }" class="router-link">
        <v-card class="subject-card">
            <SubjectIcon :role="role" size="xx-large" class="subject-icon"></SubjectIcon>
            <v-card-title class="subject-title">
                {{ subject?.name }}
                <v-icon class="">mdi-chevron-right</v-icon>
            </v-card-title>
        </v-card>
    </router-link>
</template>

<script setup lang="ts">
import type Subject from "@/models/Subject";
import { SubjectRole } from "@/models/Subject";
import SubjectIcon from "@/components/subject/extra/SubjectIcon.vue";

defineProps<{
    subject: Subject;
    role: SubjectRole;
}>();
</script>

<style scoped>
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
    height: 100px;
    background-color: rgb(var(--v-theme-secondary));
    border-radius: 3px;
}

.subject-title {
    color: rgb(var(--v-theme-text));
}

.subject-icon {
    position: absolute;
    bottom: 10px;
    right: 15px;
    color: rgb(var(--v-theme-text));
}
</style>
