<template>
    <v-card variant="text" class="title-card">
        <v-row>
            <v-col :cols="isAdmin || (isInstructor && isTeacher) ? 11 : 12">
                <div class="icon">
                    <SubjectIcon :role="role" size="xxx-large" class="subject-icon"></SubjectIcon>
                    <v-card-title class="title">
                        <div class="scrollable">
                            {{ title }}
                        </div>
                    </v-card-title>
                </div>
                <v-card-text>
                    <v-chip color="secondary" variant="flat" label class="academyyear">
                        {{
                            `${$t("subject.academy_year")} 20${academicYear}-20${academicYear + 1}`
                        }}
                    </v-chip>
                    <v-row class="instr-container">
                        <v-chip
                            v-for="instructor in instructors"
                            :key="instructor!.uid"
                            variant="outlined"
                            :color="instructor!.is_teacher ? `primary` : `green`"
                            :class="
                                instructor!.is_teacher
                                    ? `ma-1 instr-chip-instructor`
                                    : `ma-1 instr-chip-assistent`
                            "
                            exact
                        >
                            <v-icon
                                :icon="
                                    instructor!.is_teacher
                                        ? `mdi-account-tie-outline`
                                        : `mdi-school`
                                "
                                start
                            ></v-icon>
                            {{ instructor.given_name[0] }}. {{ instructor.surname }}
                        </v-chip>
                    </v-row>
                </v-card-text>
            </v-col>
            <v-col v-if="isAdmin || (isInstructor && isTeacher)" cols="1">
                <router-link
                    :to="{ name: 'edit-subject', params: { subjectId: subjectId } }"
                    class="link"
                >
                    <v-icon size="large">mdi-square-edit-outline</v-icon>
                </router-link>
            </v-col>
        </v-row>
    </v-card>
</template>

<script setup lang="ts">
import type User from "@/models/User";
import useIsAdmin from "@/composables/useIsAdmin";
import useIsTeacher from "@/composables/useIsTeacher";
import SubjectIcon from "@/components/subject/extra/SubjectIcon.vue";
import { SubjectRole } from "@/models/Subject";

defineProps<{
    subjectId: number;
    title: string;
    academicYear: number;
    instructors: User[];
    isInstructor: boolean;
    role: SubjectRole;
}>();

const { isAdmin } = useIsAdmin();
const { isTeacher } = useIsTeacher();
</script>

<style scoped>
.title-card {
    background-color: rgb(var(--v-theme-background));
    padding: 20px;
}

.scrollable {
    font-size: 32px;
    letter-spacing: -0.5px;
    text-transform: capitalize;
    font-weight: bold;
    margin-bottom: 12px;
    font-family: "Poppins", sans-serif;
    max-width: 49vw;
    overflow-x: auto;
    scrollbar-width: none;
}

.scrollable::-webkit-scrollbar {
    display: none;
}

.instr-container {
    margin-top: 1vh;
}

.link {
    text-decoration: none;
    color: inherit;
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
}

.instr-chip-instructor {
    background-color: #dfe5f7;
}

.instr-chip-assistent {
    background-color: #d0efd1;
}

.academyyear {
    border-radius: 50px;
    border: 1px solid rgb(var(--v-theme-text));
}

.icon {
    display: flex;
}
</style>
