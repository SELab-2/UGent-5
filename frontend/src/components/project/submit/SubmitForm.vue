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
import { computed, ref, toRefs } from "vue";
import FilesInput from "@/components/form_elements/FilesInput.vue";
import { useRouter } from "vue-router";
import { useCreateSubmissionMutation } from "@/queries/Project";
import { useUserGroupQuery } from "@/queries/Group";
import { useI18n } from "vue-i18n";

const props = defineProps<{
    projectId: number;
}>();

const { projectId } = toRefs(props);
const router = useRouter();
const { t } = useI18n();

const inputFiles = ref<File[]>([]);
const remarksInput = ref<string | null>(null);
const { data: group } = useUserGroupQuery(projectId);
const { mutateAsync } = useCreateSubmissionMutation(computed(() => group.value?.id));

async function formOnSubmit(event: SubmitEvent) {
    if (inputFiles.value.length === 0) {
        alert(t("submit.no_files_warning"));
        return;
    }
    const formData = new FormData(event.target as HTMLFormElement);

    for (const inputFile of inputFiles.value) {
        formData.append("files", inputFile);
    }
    const data = await mutateAsync(formData);

    const submission_id = data.id;
    await router.push(`/submission/${submission_id}`);
}
</script>

<style scoped></style>
