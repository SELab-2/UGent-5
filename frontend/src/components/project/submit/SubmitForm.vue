<template>
    <v-form validate-on="submit lazy" @submit.prevent="formOnSubmit">
        <v-container>
            <v-row>
                <v-col>
                    <FilesInput v-model="inputFiles" />
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-textarea
                        :label="$t('submit.remarks')"
                        name="remarks"
                        v-model="remarksInput"
                    />
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-btn type="submit">{{ $t("submit.submit_button") }}</v-btn>
                </v-col>
            </v-row>
        </v-container>
    </v-form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth-store";
import FilesInput from "@/components/form_elements/FilesInput.vue";

const props = defineProps({
    projectId: Number,
});

const inputFiles = ref<File[]>([]);
const remarksInput = ref<string | null>(null);

const formOnSubmit = (event: SubmitEvent) => {
    const formData = new FormData(event.target as HTMLFormElement);

    for (const inputFile of inputFiles.value) {
        formData.append("files", inputFile);
    }
    formData.append("group_id", "472"); //TODO

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
