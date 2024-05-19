<template>
    <v-card variant="text" class="title-card" width="100%" max-height="35vh">
        <v-card-title class="title">
            New Subject
        </v-card-title>

        <v-card-text>
            <v-form
                ref="form"
            >
                <v-text-field
                    v-model="project_name"
                    :rules="[rules.required, rules.length]"
                    label="Title"
                    required
                    variant="outlined"
                    placeholder="Enter Title"
                    hint="Enter your password to access this website"
                    clearable
                    hide-details="auto"
                    @keydown.enter.prevent
                    class="form-elem"
                ></v-text-field>

                <v-row>
                    <v-col>
                        <v-select
                            v-model="activeAcademicYear"
                            variant="outlined"
                            :items="academicYearItems"
                            :item-title="item => `20${item}-20${item + 1}`"
                            :item-value="item => item"
                            label="Academic Year"
                            required
                            class="form-elem-academic"
                        ></v-select>
                    </v-col>
                    <v-col>
                        <v-checkbox
                            label="Assign myself as instructor"
                            v-model="currentUserAsInstructor"
                            color="primary"
                        ></v-checkbox>
                    </v-col>
                </v-row>
            </v-form>
        </v-card-text>

    </v-card>
</template>

<script setup lang="ts">
import {ref} from "vue";
import useAcademicYear from "@/composables/useAcademicYear";

const form = ref(null);
const project_name = ref("");
const currentUserAsInstructor = ref(true);
const activeAcademicYear = ref<number>(useAcademicYear());

const academicYearItems = [activeAcademicYear.value, activeAcademicYear.value + 1];
const rules = {
    required: (value: string) => !!value || "Field is required.",
    length: (value: string) => value.length > 2 || "Title must be at least 3 characters long.",
};

</script>

<style scoped>

.title-card {
    background-color: white;
    padding: 20px;
}

.form-elem {
    margin-bottom: 2vh;
}

.form-elem-academic {
    margin-bottom: 2vh;
    max-width: 20vw;
}

.title {
    font-size: 32px;
    letter-spacing: -0.5px;
    text-transform: capitalize;
    font-weight: bold;
    margin-bottom: 12px;
    font-family: "Poppins", sans-serif;
}

</style>
