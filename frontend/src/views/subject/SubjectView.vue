<template>
    <div v-if="isError" class="v-container">
        <p>{{ $t("default.something-went-wrong") }}</p>
    </div>
    <v-skeleton-loader v-else type="card" :loading="isLoading"  >
        <v-row>
            <v-snackbar v-model="snackbar" timeout="3000" color="primary">
                {{ $t("subject.register_link_button.snackbar") }}
                <template v-slot:actions>
                    <v-btn @click="snackbar = false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </template>
            </v-snackbar>
            <v-col class="col-sm-12 col-md-6 col-lg-8 subjectcard">
                <v-row>
                    <v-col>
                        <SubjectHeaderContainer
                            v-if="subject"
                            :title="subject!.name"
                            :instructors="sortedInstructors"
                            :academic-year="subject!.academic_year"
                            :is-instructor="isInstructor"
                            :is-student="isStudent"
                            :is-admin="isAdmin"
                            image-path="https://www.ugent.be/img/dcom/faciliteiten/ufo-logo.png"
                        ></SubjectHeaderContainer>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <SubjectProjectsPage v-if="subject" :projects="projects"></SubjectProjectsPage>
                    </v-col>
                </v-row>
            </v-col>
            <v-col v-if="isAdmin || isInstructor" cols="2">
                <div class="action-btn-container">
                    <router-link :to="{ name: 'create-project', params: { subjectId: subjectId } }">
                        <v-btn prepend-icon="mdi-plus-circle" class="button">
                            {{ $t("subject.create_project") }}
                        </v-btn>
                    </router-link>
                    <RegisterLinkButton
                        v-if="isAdmin || isTeacher"
                        :subjectId="subjectId"
                        @register-link-btn-pressed="snackbar = true"
                        @is-uuid-error="isUuidError = true"
                        class="button"
                    ></RegisterLinkButton>
                </div>
            </v-col>
        </v-row>
    </v-skeleton-loader>
</template>

<script setup lang="ts">
import { computed, ref, toRefs } from "vue";
import {
    useSubjectQuery,
    useSubjectProjectsQuery,
    useSubjectInstructorsQuery,
    useSubjectStudentsQuery,
} from "@/queries/Subject";
import BackgroundContainer from "@/components/BackgroundContainer.vue";
import SubjectHeaderContainer from "@/components/subject/subjectview/header/SubjectHeaderContainer.vue";
import SubjectProjectsPage from "@/components/subject/subjectview/body/projects/SubjectProjectsPage.vue";
import { useCurrentUserQuery } from "@/queries/User";
import useIsTeacher from "@/composables/useIsTeacher";
import useIsAdmin from "@/composables/useIsAdmin";
import RegisterLinkButton from "@/components/subject/subjectview/buttons/RegisterLinkButton.vue";

const props = defineProps<{
    subjectId: number;
}>();

const { subjectId } = toRefs(props);
const snackbar = ref(false);
const isUuidError = ref(false);

const {
    data: subject,
    isLoading: isSubjectLoading,
    isError: isSubjectError,
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
const { data: user, isLoading: isUserLoading, isError: isUserError } = useCurrentUserQuery();
const {
    data: students,
    isLoading: isStudentsLoading,
    isError: isStudentsError,
} = useSubjectStudentsQuery(subjectId);

const isLoading = computed(
    () =>
        isSubjectLoading.value ||
        isProjectsLoading.value ||
        isInstructorsLoading.value ||
        isUserLoading.value ||
        isStudentsLoading.value
);
const isError = computed(
    () =>
        isSubjectError.value ||
        isProjectsError.value ||
        isInstructorsError.value ||
        isUserError.value ||
        isUuidError.value ||
        isStudentsError.value
);

const isInstructor = computed(() => {
    return [...(instructors.value || [])].some((instructor) => instructor?.uid === user.value?.uid);
});
const isStudent = computed(() => {
    return [...(students.value || [])].some((student) => student?.uid === user.value?.uid);
});

const sortedInstructors = computed(() => {
    return [...(instructors.value || [])].sort((a, b) => {
        if (a?.is_teacher && !b?.is_teacher) {
            return -1;
        } else if (!a?.is_teacher && b?.is_teacher) {
            return 1;
        } else {
            return a?.surname.localeCompare(b?.surname);
        }
    });
});

const { isAdmin } = useIsAdmin();
const { isTeacher } = useIsTeacher();
</script>
;
<style scoped>

.action-btn-container {
    margin-top: 50px;
    margin-right: 25px;
}

.subjectcard {
    background-color: rgb(var(--v-theme-secondary));
    margin-top: 50px;
    margin-left: 50px;
    margin-right: 10px;
    margin-bottom: 50px;
    border-radius: 3px;
    padding: 20px;
}

.button {
    background-color: rgb(var(--v-theme-primary));
    color: rgb(var(--v-theme-navtext));
    margin-bottom: 10px;
    width: 175px;
}


</style>
