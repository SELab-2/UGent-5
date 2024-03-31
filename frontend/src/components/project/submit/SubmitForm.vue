<template>
    <v-form validate-on="submit lazy" @submit.prevent="formOnSubmit">
        <v-container>
            <v-row v-if="inputFiles.length === 0">
                <v-col>
                    <p>{{ $t("submit.no_files_added") }}</p>
                </v-col>
            </v-row>
            <v-row v-else>
                <v-col>
                    <v-chip
                        v-for="(item, index) in inputFiles"
                        :key="item.name"
                        class="ma-2"
                        closable
                        label
                        @click:close="() => onDeleteClick(index)"
                    >
                        <v-icon icon="mdi-file" start></v-icon>
                        {{ item.name }} ({{ formatBytes(item.size) }})
                    </v-chip>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <input @change="updateFiles" ref="fileInput" type="file" multiple hidden />
                    <v-btn @click="onAddFilesClick">{{ $t("submit.add_files_button") }}</v-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-textarea
                        :label="$t('submit.remarks')"
                        name="remarks"
                        v-model="remarksInput"
                    ></v-textarea>
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

const props = defineProps({
    projectId: Number,
});

const inputFiles = ref<File[]>([]);
const remarksInput = ref<string | null>(null);

const fileInput = ref<HTMLFormElement | null>(null);

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

// https://stackoverflow.com/a/18650828
function formatBytes(bytes: number, decimals = 2) {
    if (!+bytes) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

function onAddFilesClick() {
    fileInput.value?.click();
}

function updateFiles(event: Event) {
    const files = (event.target as HTMLInputElement).files!;
    inputFiles.value.push(...files);
}

function onDeleteClick(index: number) {
    inputFiles.value.splice(index, 1);
}
</script>

<style scoped></style>
