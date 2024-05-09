<template>
    <v-card color="white">
        <v-card-title>
            {{ $t("submission.status") }}
            <p v-if="submission.date <= project.deadline" :class="Status[submission.status]">
                {{ Status[submission.status] }}
            </p>
            <p v-else class="Deadline">{{ $t("submission.after_deadline") }}</p>
        </v-card-title>
        <v-card-subtitle>
            {{ $t("submission.datetime") }} {{ $d(submission.date, "long") }}
        </v-card-subtitle>
        <v-card-item>
            <v-card-title>
                {{ $t("submission.remarks") }}
            </v-card-title>
            <v-card-text v-if="submission.remarks">
                {{ submission.remarks }}
            </v-card-text>
            <v-card-subtitle v-else>
                {{ $t("submission.remarks_empty") }}
            </v-card-subtitle>
        </v-card-item>
        <v-card-item v-if="submission.stderr || submission.stdout || submission.testresults.length">
            <v-card-title>{{ $t("submission.docker_test") }}</v-card-title>
            <v-card-text>
                <p v-if="submission.stdout">Stdout: {{ submission.stdout }}</p>
                <p v-else>{{ $t("default.no") }} stdout</p>
                <p v-if="submission.stderr">Sterr: {{ submission.stderr }}</p>
                <p v-else>{{ $t("default.no") }} stderr</p>
                <ul>
                    <li v-for="result in submission.testresults" :key="result">
                        <p v-if="result.succeeded" class="text-green">{{ result.value }}</p>
                        <p v-else class="text-red">{{ result.value }}</p>
                    </li>
                </ul>
            </v-card-text>
        </v-card-item>
        <v-card-item>
            <v-card-title>
                {{ $t("submission.files") }}
            </v-card-title>
            <v-card-subtitle>
                {{ $t("submission.download_info") }}
            </v-card-subtitle>
            <v-container>
                <v-alert v-if="isError" title="Error" color="error" :text="error.message"></v-alert>
                <v-skeleton-loader v-else :loading="isLoading" type="card" color="white">
                    <v-col>
                        <v-chip
                            class="ma-2"
                            v-for="(item, index) in files"
                            label
                            color="blue"
                            :key="item.filename"
                            @click="() => downloadFile(index)"
                        >
                            {{ item.filename }}
                        </v-chip>
                    </v-col>
                </v-skeleton-loader>
            </v-container>
        </v-card-item>
    </v-card>
</template>

<script setup lang="ts">
import { Status, type Submission } from "@/models/Submission";
import { useFilesQuery } from "@/queries/Submission";
import { toRefs, computed } from "vue";
import { download_file } from "@/utils.ts";
import Project from "@/models/Project";

const props = defineProps<{
    submission: Submission;
    project: Project;
}>();

const { submission } = toRefs(props);

const {
    data: files,
    isLoading,
    isError,
    error,
} = useFilesQuery(computed(() => submission.value?.id));

const downloadFile = (index: number) => {
    const file = files.value![index];
    download_file(`/api/submissions/${submission.value!.id}/files/${file.filename}`, file.filename);
};
</script>

<style scoped>
.Accepted {
    color: green;
}

.InProgress {
    color: orange;
}

.Rejected {
    color: red;
}

.Crashed {
    color: purple;
}

.Deadline {
    color: red;
}
</style>
