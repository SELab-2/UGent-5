<template>
    <v-card class="file-display-container" outlined>
        <v-card-title> Project Files </v-card-title>
        <v-card-text>
            <v-treeview v-model="tree" :items="treeItems" activatable hoverable open-on-click>
                <template v-slot:prepend="{ item }">
                    <v-icon>{{ getFileIcon(item.title) }}</v-icon>
                </template>
            </v-treeview>
        </v-card-text>
    </v-card>
</template>

<script setup>
import { computed, ref } from "vue";
import { VTreeview } from "vuetify/labs/VTreeview";

const props = defineProps({
    files: Array,
});

const tree = ref([]);
const initiallyOpen = ref([]); // Set specific paths if needed
const treeItems = computed(() => {
    const rootNode = {};
    props.files.forEach((file) => {
        const parts = file.filename.split("/").filter(Boolean);
        let current = rootNode;

        parts.forEach((part, index) => {
            if (!current[part]) {
                current[part] = {
                    _isFile: index === parts.length - 1,
                    children: {},
                    title: part,
                };
            }
            if (index === parts.length - 1) {
                current[part]._isFile = true;
                current[part].title = parts.slice(-1)[0];
                current[part].id = file.path;
                current[part].children = undefined;
            } else {
                current = current[part].children;
            }
        });
    });
    return buildTree(rootNode);
});

function buildTree(node, path = "") {
    const result = [];
    Object.keys(node).forEach((key) => {
        if (!node[key]._isFile && node[key].children) {
            const fullPath = path ? `${path}/${key}` : key;
            result.push({
                title: node[key].title,
                id: fullPath,
                children: buildTree(node[key].children, fullPath),
            });
        } else if (node[key]._isFile) {
            result.push({
                title: node[key].title,
                id: node[key].id,
            });
        }
    });
    return result;
}

const icons = ref({
    html: "mdi-language-html5",
    js: "mdi-nodejs",
    json: "mdi-code-json",
    md: "mdi-language-markdown",
    pdf: "mdi-file-pdf-box",
    png: "mdi-file-image",
    txt: "mdi-file-document-outline",
    xls: "mdi-file-excel",
    folder: "mdi-folder", // Closed folder icon
    folderOpen: "mdi-folder-open", // Open folder icon
});

function getFileIcon(filename) {
    // Check if the filename has a file extension
    const extension = filename.split(".").pop();
    if (extension === filename) {
        // No extension, likely a folder
        return "mdi-folder";
    } else {
        // It's a file, get the corresponding icon
        return icons.value[extension] || "mdi-file";
    }
}
</script>
