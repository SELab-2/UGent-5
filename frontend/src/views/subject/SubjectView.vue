<template>
    <div v-if="isError" class="v-container">
        <p>Error: {{ error }}</p>
    </div>

    <v-row v-else>
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
                            :is-loading="isLoading"
                            image-path="https://www.ugent.be/img/dcom/faciliteiten/ufo-logo.png"
                        ></SubjectHeaderContainer>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <SubjectBody
                            v-if="subject"
                            :projects="subject!.projects"
                            :is-loading="isLoading"
                        ></SubjectBody>
                    </v-col>
                </v-row>
            </BackgroundContainer>
        </v-col>
        <v-col cols="2">
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
</template>

<script setup lang="ts">
import { computed, ref, toRefs } from "vue";
import { useSubjectDetailsQuery } from "@/queries/Subject";
import BackgroundContainer from "@/components/BackgroundContainer.vue";
import SubjectHeaderContainer from "@/components/subject/header/SubjectHeaderContainer.vue";
import SubjectBody from "@/components/subject/body/SubjectBody.vue";
import { useRouter } from "vue-router";

const props = defineProps<{
    subjectId: number;
}>();

const { subjectId } = toRefs(props);
const snackbar = ref(false);

const { data: subject, error, isLoading, isError } = useSubjectDetailsQuery(subjectId);

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
