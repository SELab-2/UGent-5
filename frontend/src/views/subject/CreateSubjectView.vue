<template>
    <div>
        <v-form>
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
                ></v-text-field>
            </v-responsive>

            <v-select
                v-model="activeAcademicYear"
                :items="academicYearItems"
                :item-title="item => `20${item}-20${item + 1}`"
                label="Academic Year"
                required
            ></v-select>


        </v-form>
    </div>
</template>


<script setup lang="ts">


import {ref, computed} from "vue";
import useAcademicYear from "@/composables/useAcademicYear";

const project_title = ref("");

const rules = {
    required: (value: string) => !!value || "Field is required.",
};

const activeAcademicYear = ref<number>(useAcademicYear())
const academicYearItems = [activeAcademicYear.value, activeAcademicYear.value + 1];

</script>

<style scoped>

</style>
