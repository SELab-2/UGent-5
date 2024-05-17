<template>
    <div v-if="isError" class="v-container">
        <p>Error: {{ error }}</p>
    </div>

    <v-skeleton-loader v-else type="card" :loading="isLoading">
        <v-row>
            <v-snackbar v-model="snackbar" timeout="3000" color="primary">
                {{ $t("subject.register_link_button.snackbar") }}
                <template v-slot:actions>
                    <v-btn @click="snackbar = false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </template>
            </v-snackbar>

            <v-col cols="1">
                <router-link :to="{ name: 'subjects' }">
                    <v-btn variant="elevated" class="back-button" rounded="xl" size="large">
                        <v-icon>mdi-arrow-left</v-icon>
                    </v-btn>
                </router-link>
            </v-col>
            <v-col>
                <BackgroundContainer>
                    <v-row>
                        <v-col>
                            <SubjectHeaderContainer
                                v-if="subject"
                                :title="subject!.name"
                                :instructors="instructors"
                                :academic-year="subject!.academic_year"
                                :is-instructor="isInstructor"
                                image-path="https://www.ugent.be/img/dcom/faciliteiten/ufo-logo.png"
                            ></SubjectHeaderContainer>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <SubjectBody v-if="subject" :projects="projects"></SubjectBody>
                        </v-col>
                    </v-row>
                </BackgroundContainer>
            </v-col>
            <v-col v-if="isAdmin || isInstructor" cols="2">
                <div class="action-btn-container">
                    <router-link :to="{ name: 'create-project', params: { subjectId: subjectId } }">
                        <v-btn prepend-icon="mdi-plus-circle">
                            {{ $t("subject.create_project") }}
                        </v-btn>
                    </router-link>
                    <v-btn
                        v-if="isAdmin || isTeacher"
                        prepend-icon="mdi-content-copy"
                        @click="copyRegisterLink"
                    >
                        {{ $t("subject.register_link_button.title") }}
                    </v-btn>
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
    useSubjectInstructorsQuery, useUuidSubjectQuery,
} from "@/queries/Subject";
import BackgroundContainer from "@/components/BackgroundContainer.vue";
import SubjectHeaderContainer from "@/components/subject/subjectview/header/SubjectHeaderContainer.vue";
import SubjectBody from "@/components/subject/subjectview/body/SubjectBody.vue";
import { useCurrentUserQuery } from "@/queries/User";
import useIsTeacher from "@/composables/useIsTeacher";
import useIsAdmin from "@/composables/useIsAdmin";
import {useRouter} from "vue-router";

const props = defineProps<{
    subjectId: number;
}>();

const { subjectId } = toRefs(props);
const snackbar = ref(false);

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
const {
    data: user,
    isLoading: isUserLoading,
    isError: isUserError
} = useCurrentUserQuery();
const {
    data: subjectUuid,
    isLoading : isUuidLoading,
    isError : isUuidError,
} = useUuidSubjectQuery(subjectId);

const isLoading = computed(
    () =>
        isSubjectLoading.value ||
        isProjectsLoading.value ||
        isInstructorsLoading.value ||
        isUserLoading.value ||
        isUuidLoading.value
);
const isError = computed(
    () =>
        isSubjectError.value ||
        isProjectsError.value ||
        isInstructorsError.value ||
        isUserError.value ||
        isUuidError.value
);

const isInstructor = computed(() => {
    return [...(instructors.value || [])].some((instructor) => instructor?.uid === user.value?.uid);
});
const {isAdmin} = useIsAdmin();
const {isTeacher} = useIsTeacher();

const router = useRouter();

const registerLink = computed(() => {
    return router.resolve({
        name: "registerSubject",
        params: { uuid: subjectUuid.value },
    }).path;
});

const copyRegisterLink = () => {
    const baseAddress = window.location.origin;
    navigator.clipboard.writeText(`${baseAddress}${registerLink.value}`);
    snackbar.value = true;
};


</script>
;
<style scoped>
.back-button {
    margin: 30px;
}

.action-btn-container {
    margin-top: 30px;
}
</style>
