<template>
    <div v-if="isError" class="v-container">
        <p>{{ $t("default.something-went-wrong") }}</p>
    </div>

    <v-skeleton-loader :loading="isLoading" type="card">
        <v-row>
            <v-col cols="12">
                <background-container>
                    <CreateSubjectHeaderContainer
                        :image-path="`https://www.ugent.be/img/dcom/faciliteiten/ufo-logo.png`"
                        :current-user-as-instructor="currentUserAsInstructor"
                        @update:subject-name="subjectName = $event"
                        @update:active-academic-year="activeAcademicYear = $event"
                        @update:current-user-as-instructor="currentUserAsInstructor = $event"
                    >
                    </CreateSubjectHeaderContainer>
                    <CreateSubjectBody
                        :current-user="currentUser"
                        :instructors="shownInstructors"
                        @add-instructor="addInstructor"
                        @remove-instructor="removeInstructor"
                    >
                    </CreateSubjectBody>
                    <v-btn
                        class="submit-button"
                        @click="handleSubmit"
                        color="primary"
                        type="submit"
                    >
                        Create
                    </v-btn>
                </background-container>
            </v-col>
        </v-row>
    </v-skeleton-loader>
</template>


<script setup lang="ts">
import {computed, ref} from "vue";
import useAcademicYear from "@/composables/useAcademicYear";
import {useCreateSubjectInstructorMutation, useCreateSubjectMutation} from "@/queries/Subject";
import type SubjectForm from "@/models/Subject";
import type User from "@/models/User";
import {useCurrentUserQuery} from "@/queries/User";
import BackgroundContainer from "@/components/BackgroundContainer.vue";
import CreateSubjectHeaderContainer
    from "@/components/subject/createSubjectView/header/CreateSubjectHeaderContainer.vue";
import CreateSubjectBody from "@/components/subject/createSubjectView/body/CreateSubjectBody.vue";

const form = ref(null);
const subjectName = ref("");
const activeAcademicYear = ref<number>(useAcademicYear());
const instructors = ref<User[]>([]);
const currentUserAsInstructor = ref(true);
const subjectId = ref<number | undefined>(undefined);

const {data: currentUser, isLoading, isError} = useCurrentUserQuery();
const createSubjectMutation = useCreateSubjectMutation();
const createSubjectInstructorMutation = useCreateSubjectInstructorMutation(computed(() => subjectId.value));

const shownInstructors = computed(() => {
    if (currentUserAsInstructor.value) {
        return [currentUser.value, ...instructors.value];
    }
    return instructors.value;
})

const addInstructor = (user: User) => {
    instructors.value.push(user);
    instructors.value.sort((a, b) => {
        if (a?.is_teacher && !b?.is_teacher) {
            return -1;
        } else if (!a?.is_teacher && b?.is_teacher) {
            return 1;
        } else {
            return a?.surname.localeCompare(b?.surname);
        }
    });
};

const removeInstructor = (instructor: User) => {
    if (currentUser.value?.uid === instructor?.uid) {
        currentUserAsInstructor.value = false;
    } else {
        instructors.value.splice(instructors.value.indexOf(instructor), 1);
    }
};

async function handleSubmit() {

    const name = subjectName.value.trim();
    const subjectData: SubjectForm = {
        name: name.charAt(0).toUpperCase() + name.slice(1),
        academic_year: activeAcademicYear.value,
    };

    const instructorIds = shownInstructors.value.map((instructor) => instructor.uid);

    console.log("Subject data:", subjectData);
    console.log("Instructor ids:", instructorIds);

    try {
        const createdSubjectId = await createSubjectMutation.mutateAsync(subjectData);
        subjectId.value = createdSubjectId;
        console.log("Created subject with id:", createdSubjectId);

        for (const instructor of instructorIds) {
            await createSubjectInstructorMutation.mutateAsync(instructor);
            console.log("Added instructor with id:", instructor.uid);
        }
    } catch (error) {
        console.error("Error during subject creation:", error);
    }

}
</script>

<style scoped>

</style>
