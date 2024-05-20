<template>
    <router-link :to="{ name: 'subject', params: { subjectId: subject.id } }" class="router-link">
        <v-card class="subject-card" height="12vh" color="primary">
            <SubjectIcon :role="role" size="xx-large" class="subject-icon"></SubjectIcon>

                <v-card-title class="subject-title">
                    <div class="scrollable">
                        {{ subject?.name }}
                        <v-icon class="">mdi-chevron-right</v-icon>
                    </div>
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
}

.subject-title {
    color: white;
    font-size: 3vh;
    position: absolute;
    bottom: 0;
}

.scrollable {
    max-width: 25vw;
    overflow: auto;
    scrollbar-width: none;
}

.scrollable::-webkit-scrollbar {
    display: none;
}

.subject-icon {
    position: absolute;
    top: 10px;
    right: 15px;
}
</style>
