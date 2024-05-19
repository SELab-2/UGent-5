<template>
    <div class="registerview">
        <v-alert v-if="isError" title="Error" color="error" :text="error!.message"></v-alert>
        <v-skeleton-loader v-else :loading="isLoading" type="card">
            <v-container align="center" class="container">
                <h1>{{ $t("subject.register") }} {{ subject!.name }}</h1>
                <v-row v-if="!registered" justify="center" class="buttons">
                    <v-btn variant="text" class="register" @click="register">
                        {{ $t("subject.yes") }}
                    </v-btn>
                    <v-btn variant="text" class="cancel" @click="cancel">
                        {{ $t("subject.no") }}
                    </v-btn>
                </v-row>
                <v-row v-else class="registered" justify="center">
                    <h2>{{ $t("subject.registered") }}.</h2>
                </v-row>
            </v-container>
        </v-skeleton-loader>
    </div>
</template>

<script setup lang="ts">
import { computed, toRefs } from "vue";
import {
    useRegisterToSubjectMutation,
    useSubjectsQuery,
    useSubjectUuidQuery,
} from "@/queries/Subject";
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps<{
    uuid: string;
}>();
const { uuid } = toRefs(props);

const { mutateAsync: registerMutation } = useRegisterToSubjectMutation();
const { data: subjects } = useSubjectsQuery();
const { data: subject, error, isLoading, isError } = useSubjectUuidQuery(uuid);

const register = async () => {
    await registerMutation(uuid);
    router.push({ name: "subject", params: { subjectId: subject.value?.id } });
};

const registered = computed(() => {
    if (!subjects.value) return false;
    return subjects.value.as_student.some((sub) => {
        return sub.id === subject.value.id;
    });
});

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

.registered {
    margin-top: 25px;
    margin-bottom: 10px;
}
</style>
