<template>
    <v-card variant="text" class="title-card" height="165">
        <v-row>
            <v-col :cols="isAdmin || (isInstructor && isTeacher) ? 11 : 12" class="scrollable-col">
                <v-card-title class="title">
                    <div class="scrollable">
                        {{ title }}
                    </div>
                </v-card-title>
                <v-card-text>
                    <v-chip color="primary" variant="flat" label>
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
                            class="ma-1 instr-chip"
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
                <router-link to="" class="link">
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
    overflow-y: auto;
    scrollbar-width: none;
}

.title-card::-webkit-scrollbar {
    display: none;
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
</style>
