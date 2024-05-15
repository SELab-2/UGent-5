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
                                :instructors="subject!.instructors"
                                :academic-year="subject!.academic_year"
                                :is-instructor="isInstructor"
                                image-path="https://www.ugent.be/img/dcom/faciliteiten/ufo-logo.png"
                            ></SubjectHeaderContainer>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <SubjectBody v-if="subject" :projects="subject!.projects"></SubjectBody>
                        </v-col>
                    </v-row>
                </BackgroundContainer>
            </v-col>
            <v-col v-if="isInstructor" cols="2">
                <div class="action-btn-container">
                    <router-link :to="{ name: 'create-project', params: { subjectId: subjectId } }">
                        <v-btn prepend-icon="mdi-plus-circle">
                            {{ $t("subject.create_project") }}
                        </v-btn>
                    </router-link>
                    <v-btn prepend-icon="mdi-content-copy" @click="copyRegisterLink">
                        {{ $t("subject.register_link_button.title") }}
                        <v-tooltip activator="parent" location="start" max-width="200vw">
                            {{ $t("subject.register_link_button.tooltip") }}
                        </v-tooltip>
                    </v-btn>
                </div>
            </v-col>
        </v-row>
    </v-skeleton-loader>
</template>

<script setup lang="ts">
import { computed, ref, toRefs } from "vue";
import { useSubjectDetailsQuery } from "@/queries/Subject";
import BackgroundContainer from "@/components/BackgroundContainer.vue";
import SubjectHeaderContainer from "@/components/subject/subjectview/header/SubjectHeaderContainer.vue";
import SubjectBody from "@/components/subject/subjectview/body/SubjectBody.vue";
import { useRouter } from "vue-router";
import { useUserQuery } from "@/queries/User";

const props = defineProps<{
    subjectId: number;
}>();

const { subjectId } = toRefs(props);
const snackbar = ref(false);

const { data: subject, error, isLoading, isError } = useSubjectDetailsQuery(subjectId);
const { data: user } = useUserQuery(null); // refactor queries once pr querie refactor is merged

const isInstructor = computed(() => {
    return [...(subject.value?.instructors || [])].some(
        (instructor) => instructor.uid === user.value.uid
    );
});

const router = useRouter();

const registerLink = computed(() => {
    return router.resolve({
        name: "registerSubject",
        params: { uuid: subject.value?.uuid },
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
