<template>
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
    </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";

const inputFiles = defineModel<File[]>({ default: [] });
const fileInput = ref<HTMLFormElement | null>(null);

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
    // todo: check of meerdere identieke filenames aanwezig zijn
    const files = (event.target as HTMLInputElement).files!;
    inputFiles.value.push(...files);
}

function onDeleteClick(index: number) {
    inputFiles.value.splice(index, 1);
}
</script>

<style scoped></style>