<template>
    <div>
        <v-form
            ref="form"
            @submit.prevent="handleSubmit"
        >
            <v-responsive
                class="mx-auto"
                max-width="50vw"
            >
                <v-text-field
                    v-model="project_name"
                    :rules="[rules.required, rules.length]"
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
import {useCreateSubjectMutation} from "@/queries/Subject";
import type SubjectForm from "@/models/Subject";

const form = ref(null);
const project_name = ref("");
const activeAcademicYear = ref<number>(useAcademicYear());

const createSubjectMutation = useCreateSubjectMutation();


const academicYearItems = [activeAcademicYear.value, activeAcademicYear.value + 1];
const rules = {
    required: (value: string) => !!value || "Field is required.",
    length: (value: string) => value.length > 2 || "Title must be at least 3 characters long.",
};

async function handleSubmit() {
    const {valid} = await form.value.validate();
    if (!valid) {
        return;
    }

    const projectName = project_name.value.trim();
    const subjectData: SubjectForm = {
        name: projectName.charAt(0).toUpperCase() + projectName.slice(1),
        academic_year: activeAcademicYear.value,
    };

    try {
        const createdSubjectId = await createSubjectMutation.mutateAsync(subjectData);
        console.log("Created subject with id:", createdSubjectId);
    } catch (error) {
        console.error("Error during project or group creation:", error);
    }
}
</script>

<style scoped>

</style>
