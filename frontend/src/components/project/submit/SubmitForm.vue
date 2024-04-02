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
import FilesInput from "@/components/form_elements/FilesInput.vue";
import { useRouter } from "vue-router";
import { useMakeSubmissionMutation } from "@/queries/Project";

const props = defineProps<{
    projectId: number,
}>();

const inputFiles = ref<File[]>([]);
const remarksInput = ref<string | null>(null);
const { mutate } = useMakeSubmissionMutation(472); //todo

function formOnSubmit(event: SubmitEvent) {
    // const formData = new FormData(event.target as HTMLFormElement);
    const formData = new FormData();

    for (const inputFile of inputFiles.value) {
        formData.append("files", inputFile);
    }
    mutate(formData);

    // const router = useRouter();
    // const submission_id = data.id;
    // router.replace(`/submission/${submission_id}`)


}
</script>

<style scoped></style>
