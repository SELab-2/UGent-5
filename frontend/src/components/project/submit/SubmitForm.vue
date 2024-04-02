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
import { authorized_fetch } from "@/services";

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



};
</script>

<style scoped></style>
