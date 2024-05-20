<template>
    <v-card variant="text" class="title-card" height="165" max-width="50vw">
        <v-row>
            <v-col :cols="isAdmin || (isInstructor && isTeacher) ? 10 : 12" class="scrollable-col">
                <v-card-title class="title">
                    {{ title }}
                </v-card-title>
                <v-card-text>
                    <HeaderSubtitleButton
                        :title="`${$t('subject.academy_year')} 20${academicYear}-20${academicYear + 1}`"
                        :clickable="false"
                        :active="false"
                    ></HeaderSubtitleButton>
                    <div class="d-flex justify-start instr-container">
                        <HeaderSubtitleButton
                            v-for="instructor in instructors"
                            :key="instructor.uid"
                            :title="`${instructor.given_name[0]}. ${instructor.surname}`"
                            :clickable="false"
                            :active="false"
                        ></HeaderSubtitleButton>
                    </div>
                </v-card-text>
            </v-col>
            <v-col v-if="isAdmin || (isInstructor && isTeacher)" cols="2">
                <router-link to="" class="link">
                    <v-icon size="large">mdi-square-edit-outline</v-icon>
                </router-link>
            </v-col>
        </v-row>
    </v-card>
</template>

<script setup lang="ts">
import type User from "@/models/User";
import HeaderSubtitleButton from "@/components/buttons/HeaderSubtitleButton.vue";
import useIsAdmin from "@/composables/useIsAdmin";
import useIsTeacher from "@/composables/useIsTeacher";

defineProps<{
    title: string;
    academicYear: number;
    instructors: User[];
    isInstructor: boolean;
}>();

const { isAdmin } = useIsAdmin();
const { isTeacher } = useIsTeacher();
</script>

<style scoped>
.title-card {
    background-color: white;
    padding: 20px;
    overflow: auto;
    scrollbar-width: none;
}

.title-card::-webkit-scrollbar {
    display: none;
}

.title {
    font-size: 32px;
    letter-spacing: -0.5px;
    text-transform: capitalize;
    font-weight: bold;
    margin-bottom: 12px;
    font-family: "Poppins", sans-serif;
    white-space: normal;
}

.instr-container {
    margin-top: 10px;
    margin-bottom: 5px;
}

.link {
    text-decoration: none;
    color: inherit;
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
}
</style>
