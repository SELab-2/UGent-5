<template>
    <div v-if="isError" class="v-container">
        <p>{{ $t("default.something-went-wrong") }}</p>
    </div>

    <v-skeleton-loader v-else :loading="isLoading" type="card">
        <v-snackbar
            v-model="snackbar"
            :timeout="3500"
            color="error"
            top
        >
            {{ $t("create_subject.error_snackbar") }}
        </v-snackbar>

        <v-dialog
            v-model="dialog"
            max-width="290"
            persistent
        >
            <v-card>
                <v-card-title class="headline">
                    {{ $t("create_subject.cancel_dialog") }}
                </v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="blue darken-1"
                        @click="dialog = false"
                    >
                        {{ $t("default.no_capital")}}
                    </v-btn>
                    <v-btn
                        color="blue darken-1"
                        @click="router.push({name: 'subjects'})"
                    >
                        {{ $t("default.yes_capital")}}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-row>
            <v-col cols="1">
                <v-btn
                    variant="elevated"
                    class="back-button"
                    size="large"
                    @click="dialog = true"
                >
                    <v-icon>mdi-arrow-left</v-icon>
                </v-btn>
            </v-col>
            <v-col cols="11">
                <background-container>
                    <CreateSubjectHeaderContainer
                        :image-path="`https://www.ugent.be/img/dcom/faciliteiten/ufo-logo.png`"
                        :current-user-as-instructor="currentUserAsInstructor"
                        :is-form-error="isFormError"
                        @update:subject-name="onSubjectNameUpdated"
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

                    <div
                        class="confirm-btn-container"
                    >
                        <v-btn
                            class="ma-2"
                            color="grey"
                            @click="dialog = true"
                        >
                            {{ $t("default.cancel")}}
                        </v-btn>
                        <v-btn
                            class="ma-2"
                            @click="handleSubmit"
                            color="primary"
                            type="submit"
                        >
                            {{ $t("default.confirm")}}
                        </v-btn>
                    </div>

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
import {useRouter} from "vue-router";

const snackbar = ref(false);
const dialog = ref(false);
const isFormError = ref(false);
const subjectName = ref("");
const activeAcademicYear = ref<number>(useAcademicYear());
const instructors = ref<User[]>([]);
const currentUserAsInstructor = ref(true);
const subjectId = ref<number | undefined>(undefined);

const {data: currentUser, isLoading, isError} = useCurrentUserQuery();
const createSubjectMutation = useCreateSubjectMutation();
const createSubjectInstructorMutation = useCreateSubjectInstructorMutation(computed(() => subjectId.value));

const router = useRouter();

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

const onSubjectNameUpdated = (name: string) => {
    subjectName.value = name;
    isFormError.value = false;
};

const validateSubjectName = () => {
    return !(!subjectName.value || subjectName.value.trim().length < 3);

};

const validateInstructors = () => {
    return (
        shownInstructors.value.length > 0 &&
        shownInstructors.value.some((instructor) => instructor.is_teacher)
    );
};

async function handleSubmit() {

    if (!validateSubjectName()) {
        isFormError.value = true;
        return;
    }

    if (!validateInstructors()) {
        snackbar.value = true;
        return;
    }

    const name = subjectName.value.trim();
    const subjectData: SubjectForm = {
        name: name.charAt(0).toUpperCase() + name.slice(1),
        academic_year: activeAcademicYear.value,
    };

    const instructorIds = shownInstructors.value.map((instructor) => instructor.uid);


    try {
        subjectId.value = await createSubjectMutation.mutateAsync(subjectData);
        for (const instructor of instructorIds) {
            await createSubjectInstructorMutation.mutateAsync(instructor);
        }

        await router.push({name: 'subject', params: {subjectId: subjectId.value}});
    } catch (error) {
        console.error("Error during subject creation:", error);
    }
}
</script>

<style scoped>

.confirm-btn-container {
    display: flex;
    position: absolute;
    right: 4vw;
    bottom: 4vw;
    margin-top: 2vh;
}

.back-button {
    margin: 30px;
}

</style>
