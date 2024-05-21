<template>
    <div v-if="isError" class="v-container">
        <p>{{ $t("default.something-went-wrong") }}</p>
    </div>

    <v-row v-else>
        <v-col cols="1">
            <v-btn variant="elevated" class="back-button" size="large" @click="dialog = true">
                <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
        </v-col>
        <v-col cols="11">
            <v-skeleton-loader :loading="isLoading" type="card" class="ma-8">
                <v-snackbar v-model="snackbar" :timeout="3500" color="error" top>
                    {{ $t("create_subject.error_snackbar") }}
                </v-snackbar>

                <v-dialog v-model="dialog" max-width="290" persistent>
                    <v-card>
                        <v-card-title class="headline">
                            {{ $t("create_subject.cancel_dialog") }}
                        </v-card-title>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" @click="dialog = false">
                                {{ $t("default.no_capital") }}
                            </v-btn>
                            <v-btn color="blue darken-1" @click="router.push({ name: 'subjects' })">
                                {{ $t("default.yes_capital") }}
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <div class="flex-container">
                    <CreateSubjectHeaderContainer
                        title="Edit Subject"
                        :image-path="`https://www.ugent.be/img/dcom/faciliteiten/ufo-logo.png`"
                        :subject-name="subject!.name"
                        :academic-year="subject!.academic_year"
                        :current-user-as-instructor="currentUserAsInstructor"
                        :is-form-error="isFormError"
                        @update:subject-name="onSubjectNameUpdated"
                        @update:active-academic-year="activeAcademicYear = $event"
                        @update:current-user-as-instructor="onCurrentUserAsInstructorChanged"
                    >
                    </CreateSubjectHeaderContainer>
                    <CreateSubjectBody
                        :current-user="currentUser"
                        :instructors="shownInstructors"
                        @add-instructor="addInstructor"
                        @remove-instructor="removeInstructor"
                    >
                    </CreateSubjectBody>
                </div>

                <div class="confirm-btn-container">
                    <v-btn class="ma-2" color="grey" @click="dialog = true">
                        {{ $t("default.cancel") }}
                    </v-btn>
                    <v-btn class="ma-2" @click="handleSubmit" color="primary" type="submit">
                        {{ $t("default.confirm") }}
                    </v-btn>
                </div>
            </v-skeleton-loader>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import {computed, ref, toRefs} from "vue";
import useAcademicYear from "@/composables/useAcademicYear";
import {
    useCreateSubjectInstructorMutation,
    useCreateSubjectMutation, useSubjectInstructorsQuery,
    useSubjectProjectsQuery,
    useSubjectQuery, useUpdateSubjectMutation
} from "@/queries/Subject";
import type SubjectForm from "@/models/Subject";
import type User from "@/models/User";
import {useCurrentUserQuery} from "@/queries/User";
import {useRouter} from "vue-router";
import CreateSubjectHeaderContainer from "@/components/subject/modify/create/header/CreateSubjectHeaderContainer.vue";
import CreateSubjectBody from "@/components/subject/modify/create/body/CreateSubjectBody.vue";

const props = defineProps<{
    subjectId: number;
}>();

const {subjectId} = toRefs(props);

const snackbar = ref(false);
const dialog = ref(false);
const isFormError = ref(false);
const subjectName = ref(null);
const activeAcademicYear = ref(null);
const currentUserAsInstructor = ref(computed(() => isInstructor.value));
const addedInstructors = ref<Set<User>>(new Set());
const removedInstructors = ref<Set<string>>(new Set());
const subjectChanged = ref(false);

const {
    data: currentUser,
    isLoading: isCurrentUserLoading,
    isError: isCurrentUserError
} = useCurrentUserQuery();
const {
    data: subject,
    isLoading: isSubjectLoading,
    isError: isSubjectError
} = useSubjectQuery(subjectId);
const {
    data: projects,
    isLoading: isProjectsLoading,
    isError: isProjectsError,
} = useSubjectProjectsQuery(subjectId);
const {
    data: instructors,
    isLoading: isInstructorsLoading,
    isError: isInstructorsError,
} = useSubjectInstructorsQuery(subjectId);

const isLoading = computed(
    () =>
        isCurrentUserLoading.value ||
        isSubjectLoading.value ||
        isProjectsLoading.value ||
        isInstructorsLoading.value
);

const isError = computed(
    () =>
        isCurrentUserError.value ||
        isSubjectError.value ||
        isProjectsError.value ||
        isInstructorsError.value
);

const isInstructor = computed(() => {
    return shownInstructors.value.some((instructor) => instructor?.uid === currentUser.value?.uid);
});

const isCurrentInstructor = (user: User) => {
    return new Set([...(instructors.value || [])].map((instructor) => instructor.uid)).has(user.uid)
}

const name = computed<string | null>(() => subjectChanged.value ? subjectName.value : subject.value?.name);
const academicYear = computed<number | null>(() => activeAcademicYear.value || subject.value?.academic_year);

const {mutateAsync: updateSubject} = useUpdateSubjectMutation();

const router = useRouter();


const shownInstructors = computed(() => {
    return Array.from(new Set([...(instructors.value || []), ...addedInstructors.value].filter((instructor: User) => {
        return !removedInstructors.value.has(instructor.uid);
    }))).sort((a, b) => {
        if (a?.is_teacher && !b?.is_teacher) {
            return -1;
        } else if (!a?.is_teacher && b?.is_teacher) {
            return 1;
        } else {
            return a?.surname.localeCompare(b?.surname);
        }
    })
});

const addInstructor = (instructor: User) => {
    if (isCurrentInstructor(instructor)) {
        removedInstructors.value.delete(instructor.uid);
    } else {
        addedInstructors.value.add(instructor);
    }

};

const removeInstructor = (instructor: User) => {
    if (isCurrentInstructor(instructor)) {
        removedInstructors.value.add(instructor.uid);
    }
    addedInstructors.value.delete(instructor);
};

const onCurrentUserAsInstructorChanged = (isCurrentUserInstructor: boolean) => {
    if (isCurrentUserInstructor) {
        removedInstructors.value.delete(currentUser.value.uid);
    } else {
        removedInstructors.value.add(currentUser.value.uid);
    }
};

const onSubjectNameUpdated = (name: string) => {
    subjectName.value = name;
    subjectChanged.value = true;
    isFormError.value = false;
};

const validateSubjectName = () => {
    if (!subjectChanged.value) {
        return true;
    } else {
        return name.value !== null && name.value.trim().length > 2;
    }
};
const validateSubjectAcademicYear = () => {
    return academicYear.value !== null;
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

    if (!validateSubjectAcademicYear()) {
        return;
    }

    if (!validateInstructors()) {
        snackbar.value = true;
        return;
    }

    const subjectData: SubjectForm = {
        name: name.value.trim().charAt(0).toUpperCase() + name.value.trim().slice(1),
        academic_year: academicYear.value
    };

    console.log(subjectData)
    const instructorIds = shownInstructors.value.map((instructor) => instructor.uid);
    console.log(instructorIds)




    /*
    try {
        await updateSubject({
            subjectId: subjectId.value,
            name: subjectData.name,
            academic_year: subjectData.academic_year,
        });
    } catch (error) {
        console.error("Error during subject alteration:", error);
    }

     */
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

.flex-container {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    width: 100%;
}
</style>
