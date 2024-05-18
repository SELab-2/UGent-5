<template>
    <div>
        <v-form @submit.prevent="handleSubmit">
            <v-responsive
                class="mx-auto"
                max-width="50vw"
            >
                <v-text-field
                    v-model="project_title"
                    :rules="[rules.required]"
                    label="Title"
                    required
                    variant="solo-inverted"
                    placeholder="Enter Title"
                    hint="Enter your password to access this website"
                    clearable
                    hide-details="auto"
                    @keydown.enter.prevent
                ></v-text-field>
            </v-responsive>

            <v-select
                v-model="activeAcademicYear"
                :items="academicYearItems"
                :item-title="item => `20${item}-20${item + 1}`"
                :item-value="item => item"
                label="Academic Year"
                required
            ></v-select>

            <v-btn
                color="primary"
                type="submit"
            >
                Submit
            </v-btn>

        </v-form>
    </div>
</template>


<script setup lang="ts">


import {ref} from "vue";
import useAcademicYear from "@/composables/useAcademicYear";

const project_title = ref("");
const activeAcademicYear = ref<number>(useAcademicYear());

const academicYearItems = [activeAcademicYear.value, activeAcademicYear.value + 1];
const rules = {
    required: (value: string) => !!value || "Field is required.",
};

const handleSubmit = (e: Event) => {
    console.log(project_title.value);
    console.log(activeAcademicYear.value);
};

</script>

<style scoped>

</style>
