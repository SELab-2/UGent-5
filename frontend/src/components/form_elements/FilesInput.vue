<template>
    <v-container>
        <v-row>
            <v-col>
                <input @change="handleFileChange" ref="fileInput" type="file" multiple hidden />
                <v-btn class="mb-0" @click="triggerFileInput">{{ $t("submit.add_files_button") }}</v-btn>
            </v-col>
        </v-row>
        <v-row class="mt-0">
            <v-col>
                <div v-if="modelValue.length === 0">
                    <p>{{ $t("submit.no_files_added") }}</p>
                </div>
                <div v-else>
                    <v-chip
                        v-for="(file, index) in modelValue"
                        :key="file.name"
                        class="ma-1"
                        closable
                        @click:close="deleteFile(index)"
                    >
                        <v-icon icon="mdi-file" start></v-icon>
                        {{ file.name }} ({{ formatBytes(file.size) }})
                    </v-chip>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";

// Props and emits
const props = defineProps({
    modelValue: {
        type: Array,
        required: true,
    }
});

const emits = defineEmits(["update:modelValue"]);

const fileInput = ref<HTMLInputElement | null>(null);

function formatBytes(bytes: number, decimals = 2) {
    if (!+bytes) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

function triggerFileInput() {
    fileInput.value?.click();
}

function handleFileChange(event) {
    const newFiles = event.target.files ? Array.from(event.target.files) : [];
    emits("update:modelValue", [...props.modelValue, ...newFiles]);
}

function deleteFile(index) {
    const updatedFiles = [...props.modelValue];
    updatedFiles.splice(index, 1);
    emits("update:modelValue", updatedFiles);
}
</script>

<style scoped></style>
