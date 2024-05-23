<template>
    <BackgroundContainer>
        <v-alert v-if="isError" title="Error" color="error" :text="error.message"></v-alert>
        <v-skeleton-loader v-else :loading="isLoading" type="card" color="white">
            <v-container align="center">
                <h1>{{ $t("subject.register") }} {{ subject.name }}</h1>
                <v-row justify="center">
                    <v-btn variant="text" class="register" @click="register"> Ok </v-btn>
                    <v-btn variant="text" class="cancel" @click="cancel"> Cancel </v-btn>
                </v-row>
            </v-container>
        </v-skeleton-loader>
    </BackgroundContainer>
</template>

<script setup lang="ts">
import { ref } from "vue";
import BackgroundContainer from "@/components/BackgroundContainer.vue";
import { registerSubjectQuery, useSubjectUuidQuery } from "@/queries/Subject";
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps<{
    uuid: string;
}>();

const { refetch } = registerSubjectQuery(ref(props.uuid));
const { data: subject, error, isLoading, isError } = useSubjectUuidQuery(ref(props.uuid));

const register = () => {
    refetch();
    router.push({ name: "subject", params: { subjectId: subject.value?.id } });
};

const cancel = () => router.push({ name: "home" });
</script>

<style scoped lang="scss">
.h1 {
    margin-bottom: 30px;
}
</style>
