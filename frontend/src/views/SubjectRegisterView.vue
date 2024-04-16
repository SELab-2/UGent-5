<template>
    <BackgroundContainer>
        <v-alert v-if="isError" title="Error" color="error" :text="error.message"></v-alert>
        <div v-if="isError" class="v-container"></div>
        <v-skeleton-loader v-else :loading="isLoading" type="card" color="white">
            <v-container align="center">
                <h1>{{ $t("subject.register") }} {{ user.name }}</h1>
                <v-row justify="center">
                    <v-btn variant="text" class="register" @click="register"> Ok </v-btn>
                    <v-btn variant="text" class="cancel" @click="cancel"> Cancel </v-btn>
                </v-row>
            </v-container>
        </v-skeleton-loader>
    </BackgroundContainer>
</template>

<script setup lang="ts">
import BackgroundContainer from "@/components/BackgroundContainer.vue";
import { registerSubjectQuery, useSubjectUuidQuery } from "@/queries/Subject";
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps<{
    uuid: string;
}>();

const { refetch } = registerSubjectQuery(props.uuid);
const { data: user, error, isLoading, isError } = useSubjectUuidQuery(props.uuid);

const register = () => {
    refetch();
    router.push({ name: "subject", params: { subjectId: user.id } });
};

const cancel = () => router.push({ name: "home" });
</script>

<style scoped lang="scss">
.h1 {
    margin-bottom: 30px;
}
</style>
