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
import { useMakeSubmissionMutation } from "@/queries/Project";
import { useUserGroupQuery } from "@/queries/Group";

const props = defineProps<{
    projectId: number;
}>();

const { projectId } = toRefs(props);
const router = useRouter();

const inputFiles = ref<File[]>([]);
const remarksInput = ref<string | null>(null);
const { data: groupId } = useUserGroupQuery(projectId);
const { mutateAsync } = useMakeSubmissionMutation(computed(() => groupId.value!));

async function formOnSubmit(event: SubmitEvent) {
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
