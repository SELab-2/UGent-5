<template>
    <v-form validate-on="submit lazy" @submit.prevent="formOnSubmit">
        <v-file-input counter multiple show-size chips dense name="files" v-model="fileInputs">
        </v-file-input>
        <v-textarea
            :label="$t('submit.remarks')"
            name="remarks"
            v-model="remarksInput"
        ></v-textarea>
        <v-btn type="submit">{{ $t("submit.submit_button") }}</v-btn>
    </v-form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth-store";

const props = defineProps({
    projectId: Number,
});

const fileInputs = ref<File[]>([]);
const remarksInput = ref<string | null>(null);

const formOnSubmit = (event: SubmitEvent) => {
    const formData = new FormData(event.target as HTMLFormElement);

    const apiUrl = import.meta.env.VITE_API_URL;
    const { token } = useAuthStore();

    fetch(`${apiUrl}/api/projects/${props.projectId}`, {
        method: "post",
        headers: {
            Authorization: `${token?.token_type} ${token?.token}`,
        },
        body: formData,
    })
        .then((data) => data.json())
        .then((json) => {
            console.log("Request succeeded with JSON response", json);
        })
        .catch((error) => {
            console.log("Request failed", error);
        });
};
</script>

<style scoped></style>
