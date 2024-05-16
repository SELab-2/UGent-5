<template>
<<<<<<< joincourse_testen
    <div class="registerview">
        <v-alert v-if="isError" title="Error" color="error" :text="error.message"></v-alert>
        <v-skeleton-loader v-else :loading="isLoading" type="card">
            <v-container align="center" class="container">
                <h1>{{ $t("subject.register") }} {{ subject.name }}</h1>
                <v-row justify="center" class="buttons">
                    <v-btn variant="text" class="register" @click="register">
                        {{ $t("subject.ok") }}
                    </v-btn>
                    <v-btn variant="text" class="cancel" @click="cancel">
                        {{ $t("subject.cancel") }}
                    </v-btn>
=======
    <BackgroundContainer>
        <v-alert v-if="isError" title="Error" color="error" :text="error!.message"></v-alert>
        <v-skeleton-loader v-else :loading="isLoading" type="card" color="white">
            <v-container align="center">
                <h1>{{ $t("subject.register") }} {{ subject!.name }}</h1>
                <v-row justify="center">
                    <v-btn variant="text" class="register" @click="register"> Ok </v-btn>
                    <v-btn variant="text" class="cancel" @click="cancel"> Cancel </v-btn>
>>>>>>> dev
                </v-row>
            </v-container>
        </v-skeleton-loader>
    </div>
</template>

<script setup lang="ts">
<<<<<<< joincourse_testen
import { ref } from "vue";
import { registerSubjectQuery, useSubjectUuidQuery } from "@/queries/Subject";
=======
import { toRefs } from "vue";
import BackgroundContainer from "@/components/BackgroundContainer.vue";
import { useRegisterToSubjectMutation, useSubjectUuidQuery } from "@/queries/Subject";
>>>>>>> dev
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps<{
    uuid: string;
}>();
const { uuid } = toRefs(props);

const { mutateAsync: registerMutation } = useRegisterToSubjectMutation();
const { data: subject, error, isLoading, isError } = useSubjectUuidQuery(uuid);

const register = async () => {
    await registerMutation(uuid);
    router.push({ name: "subject", params: { subjectId: subject.value?.id } });
};

const cancel = () => router.push({ name: "home" });
</script>

<style scoped lang="scss">
.registerview {
    margin: 25px;
}

.buttons {
    margin-top: 50px;
}

.container {
    background-color: rgb(var(--v-theme-secondary));
    border-radius: 3px;
    color: rgb(var(--v-theme-text));
}
</style>
