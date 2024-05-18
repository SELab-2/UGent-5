<template>
    <div v-if="isError" class="v-container">
        <p>{{ $t("default.something-went-wrong") }}</p>
    </div>

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

            <v-checkbox
                label="Assign myself as instructor"
                v-model="currentUserAsInstructor"
            ></v-checkbox>

            <v-chip-group
                column
            >
                <v-chip
                    v-for="instructor in shownInstructors"
                    :key="instructor!.uid"
                    closable
                    @click:close="onInstructorChipClose(instructor)"

                >
                    {{ instructor.given_name[0] }}. {{ instructor.surname }}
                </v-chip>

            </v-chip-group>

            <v-btn
                color="primary"
                type="submit"
            >
                Submit
            </v-btn>

        </v-form>

        <UserSearchList
            :instructors="instructors"
            :current-user="currentUser"
            @add-instructor="addInstructor"
        ></UserSearchList>
    </div>
</template>


<script setup lang="ts">


import {computed, ref} from "vue";
import useAcademicYear from "@/composables/useAcademicYear";
import {useCreateSubjectMutation} from "@/queries/Subject";
import type SubjectForm from "@/models/Subject";
import UserSearchList from "@/components/subject/createSubjectView/UserSearchList.vue";
import type User from "@/models/User";
import {useCurrentUserQuery} from "@/queries/User";

const form = ref(null);
const project_name = ref("");
const activeAcademicYear = ref<number>(useAcademicYear());
const instructors = ref<User[]>([]);
const currentUserAsInstructor = ref(true);

const {data: currentUser, isLoading, isError} = useCurrentUserQuery();
const createSubjectMutation = useCreateSubjectMutation();


const academicYearItems = [activeAcademicYear.value, activeAcademicYear.value + 1];
const rules = {
    required: (value: string) => !!value || "Field is required.",
    length: (value: string) => value.length > 2 || "Title must be at least 3 characters long.",
};

const shownInstructors = computed(() => {
    if (currentUserAsInstructor.value) {
        return [currentUser.value, ...instructors.value];
    }
    return instructors.value;
})

const addInstructor = (user: User) => {
    instructors.value.push(user);
    console.log(instructors.value);
};

const onInstructorChipClose = (instructor: User) => {
    if (currentUser.value?.uid === instructor?.uid) {
        currentUserAsInstructor.value = false;
    } else {
        instructors.value.splice(instructors.value.indexOf(instructor), 1);
    }
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
