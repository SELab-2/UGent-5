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
                            {{ $t("patch_subject.cancel_dialog") }}
                        </v-card-title>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" @click="dialog = false">
                                {{ $t("default.no_capital") }}
                            </v-btn>
                            <v-btn
                                color="blue darken-1"
                                @click="
                                    router.push({
                                        name: 'subject',
                                        params: { subjectId: subjectId },
                                    })
                                "
                            >
                                {{ $t("default.yes_capital") }}
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <div class="flex-container">
                    <ModifySubjectHeaderContainer
                        :title="$t('patch_subject.edit_subject')"
                        :image-path="`https://www.ugent.be/img/dcom/faciliteiten/ufo-logo.png`"
                        :subject-name="subject!.name"
                        :academic-year="subject!.academic_year"
                        :subject-mail="subject!.email || ''"
                        :current-user-as-instructor="currentUserAsInstructor"
                        :is-subject-name-error="isSubjectNameError"
                        :is-subject-mail-error="isSubjectMailError"
                        @update:subject-name="onSubjectNameUpdated"
                        @update:subject-mail="onSubjectMailUpdated"
                        @update:active-academic-year="activeAcademicYear = $event"
                        @update:current-user-as-instructor="onCurrentUserAsInstructorChanged"
                    >
                    </ModifySubjectHeaderContainer>
                    <ModifySubjectBody
                        :current-user="currentUser"
                        :instructors="pageUpdating ? tempInstructors : shownInstructors"
                        @add-instructor="addInstructor"
                        @remove-instructor="removeInstructor"
                    >
                    </ModifySubjectBody>
                </div>

                <div class="confirm-btn-container">
                    <v-btn class="ma-2" color="grey" @click="dialog = true">
                        {{ $t("default.cancel") }}
                    </v-btn>
                    <v-btn class="ma-2" @click.prevent="handleSubmit" color="primary" type="submit">
                        {{ $t("default.confirm") }}
                    </v-btn>
                </div>
            </v-skeleton-loader>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { computed, ref, toRefs } from "vue";
import {
    useCreateSubjectInstructorMutation,
    useDeleteSubjectInstructorMutation,
    useSubjectInstructorsQuery,
    useSubjectQuery,
    useUpdateSubjectMutation,
} from "@/queries/Subject";
import type SubjectForm from "@/models/Subject";
import type User from "@/models/User";
import { useCurrentUserQuery } from "@/queries/User";
import { useRouter } from "vue-router";
import ModifySubjectHeaderContainer from "@/components/subject/modify/header/ModifySubjectHeaderContainer.vue";
import ModifySubjectBody from "@/components/subject/modify/body/ModifySubjectBody.vue";

const props = defineProps<{
    subjectId: number;
}>();

const { subjectId } = toRefs(props);

const snackbar = ref(false);
const dialog = ref(false);
const isSubjectNameError = ref(false);
const isSubjectMailError = ref(false);
const subjectName = ref("");
const subjectMail = ref("");
const activeAcademicYear = ref<number | null>(null);
const currentUserAsInstructor = ref(computed(() => isInstructor.value));
const addedInstructors = ref<Set<User>>(new Set());
const removedInstructorUIDs = ref<Set<string>>(new Set());
const subjectNameChanged = ref(false);
const subjectMailChanged = ref(false);
const pageUpdating = ref(false);
const tempInstructors = ref<User[]>([]);

const {
    data: currentUser,
    isLoading: isCurrentUserLoading,
    isError: isCurrentUserError,
} = useCurrentUserQuery();
const {
    data: subject,
    isLoading: isSubjectLoading,
    isError: isSubjectError,
} = useSubjectQuery(subjectId);
const {
    data: instructors,
    isLoading: isInstructorsLoading,
    isError: isInstructorsError,
} = useSubjectInstructorsQuery(subjectId);

const { mutateAsync: updateSubject } = useUpdateSubjectMutation();
const { mutateAsync: createSubjectInstructor } = useCreateSubjectInstructorMutation();
const { mutateAsync: deleteSubjectInstructor } = useDeleteSubjectInstructorMutation();

const isLoading = computed(
    () => isCurrentUserLoading.value || isSubjectLoading.value || isInstructorsLoading.value
);

const isError = computed(
    () => isCurrentUserError.value || isSubjectError.value || isInstructorsError.value
);

const isInstructor = computed(() => {
    return shownInstructors.value.some((instructor) => instructor?.uid === currentUser.value?.uid);
});

const isCurrentInstructor = (user: User) => {
    return new Set([...(instructors.value || [])].map((instructor) => instructor.uid)).has(
        user.uid
    );
};

const name = computed(() =>
    subjectNameChanged.value ? subjectName.value || "" : subject.value!.name
);
const academicYear = computed(() => activeAcademicYear.value || subject.value!.academic_year);
const mail = computed(() =>
    subjectMailChanged.value ? subjectMail.value || "" : subject.value!.email || ""
);

const router = useRouter();

const shownInstructors = computed(() => {
    return Array.from(
        new Set(
            [...(instructors.value || []), ...addedInstructors.value].filter((instructor: User) => {
                return !removedInstructorUIDs.value.has(instructor.uid);
            })
        )
    ).sort((a, b) => {
        if (a?.is_teacher && !b?.is_teacher) {
            return -1;
        } else if (!a?.is_teacher && b?.is_teacher) {
            return 1;
        } else {
            return a?.surname.localeCompare(b?.surname);
        }
    });
});

const getInstructor = (instructorUID: string) => {
    return [...(instructors.value || [])].find((i) => i.uid === instructorUID);
};

const addInstructor = (instructor: User) => {
    if (isCurrentInstructor(instructor)) {
        removedInstructorUIDs.value.delete(instructor.uid);
    } else {
        addedInstructors.value.add(instructor);
    }
};

const removeInstructor = (instructor: User) => {
    if (isCurrentInstructor(instructor)) {
        removedInstructorUIDs.value.add(instructor.uid);
    }
    addedInstructors.value.delete(instructor);
};

const onCurrentUserAsInstructorChanged = (isCurrentUserInstructor: boolean) => {
    if (isCurrentUserInstructor) {
        removedInstructorUIDs.value.delete(currentUser.value.uid);
    } else {
        removedInstructorUIDs.value.add(currentUser.value.uid);
    }
};

const onSubjectNameUpdated = (name: string) => {
    subjectName.value = name;
    subjectNameChanged.value = true;
    isSubjectNameError.value = false;
};

const onSubjectMailUpdated = (mail: string) => {
    subjectMail.value = mail;
    subjectMailChanged.value = true;
    isSubjectMailError.value = false;
};

const validateSubjectName = () => {
    if (!subjectNameChanged.value) {
        return true;
    }
    return name.value.trim() !== "" && name.value.trim().length > 2;
};

const validateSubjectMail = () => {
    if (!subjectMailChanged.value) {
        return true;
    }
    return subjectMail.value == "" || /.+@.+\..+/.test(subjectMail.value.trim());
};

const validateInstructors = () => {
    return (
        shownInstructors.value.length > 0 &&
        shownInstructors.value.some((instructor) => instructor.is_teacher)
    );
};

async function handleSubmit() {
    if (!validateSubjectName()) {
        isSubjectNameError.value = true;
        return;
    }

    if (!validateSubjectMail()) {
        isSubjectMailError.value = true;
        return;
    }

    if (!validateInstructors()) {
        snackbar.value = true;
        return;
    }

    const subjectData: SubjectForm = {
        name: name.value.trim().charAt(0).toUpperCase() + name.value.trim().slice(1),
        email: mail.value.trim(),
        academic_year: academicYear.value,
    };

    try {
        await updateSubject({ subject: subjectData, subjectId: subjectId.value });

        pageUpdating.value = true;
        tempInstructors.value = [...shownInstructors.value];

        for (let instructorUID of removedInstructorUIDs.value) {
            const instructor = getInstructor(instructorUID);
            if (instructor)
                await deleteSubjectInstructor({
                    subjectId: subjectId.value,
                    user: instructor,
                });
        }

        for (let instructor of addedInstructors.value) {
            await createSubjectInstructor({
                subjectId: subjectId.value,
                user: instructor,
            });
        }

        await router.push({ name: "subject", params: { subjectId: subjectId.value } });
    } catch (error) {
        console.error("Error during subject alteration:", error);
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

.flex-container {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    width: 100%;
}
</style>
