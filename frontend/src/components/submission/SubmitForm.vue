<template>
    <div>
        <RequirementsCard v-if="project.requirements.length > 0" :requirements=project.requirements :unmetRequirements=unmetRequirements  />
        <v-form validate-on="submit lazy" @submit.prevent="formOnSubmit" class="submission-form">
            <FilesInput v-model="inputFiles" />
            <v-textarea :label="$t('submit.remarks')" name="remarks" v-model="remarksInput" />
            <v-btn variant="flat" type="submit">{{ $t("submit.submit_button") }}</v-btn>
        </v-form>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, toRefs } from "vue";
import FilesInput from "@/components/form_elements/FilesInput.vue";
import { useRouter } from "vue-router";
import { useCreateSubmissionMutation } from "@/queries/Submission";
import { useUserGroupQuery } from "@/queries/Group";
import { useI18n } from "vue-i18n";
import RequirementsCard from "@/components/project/RequirementsCard.vue";
import type Project from "@/models/Project";
import type { UnmetRequirement } from "@/models/Project";

const props = defineProps<{
    project: Project;
}>();

const { project } = toRefs(props);
const projectId = computed(() => project.value.id)
const groupId = computed(() => group.value?.id)

const router = useRouter();
const { t } = useI18n();

const inputFiles = ref<File[]>([]);
const remarksInput = ref<string | null>(null);
const unmetRequirements = ref<UnmetRequirement[]>([]);

const { data: group } = useUserGroupQuery(projectId);
const { mutateAsync } = useCreateSubmissionMutation(groupId);

async function formOnSubmit(event: SubmitEvent) {
    if (inputFiles.value.length === 0) {
        alert(t("submit.no_files_warning"));
        return;
    }
    const formData = new FormData(event.target as HTMLFormElement);

    for (const inputFile of inputFiles.value) {
        formData.append("files", inputFile);
    }

    try {
        await mutateAsync(formData);
        await router.push(`/groups/${group.value?.id}/submissions`);
    } catch (error) {
        if (error instanceof(Error)) {
            unmetRequirements.value = error.cause.map(r => {
                return {requirement: {mandatory: r.mandatory, value: r.value},
                files: r.files}
            })
        }
    }

}
</script>

<style scoped>
.v-btn {
    background-color: rgb(var(--v-theme-secondary));
}

.v-textarea {
    margin-top: 30px;
}

.submission-form {
    margin-top: 30px;
}
</style>
