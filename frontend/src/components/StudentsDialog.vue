<template>
    <v-btn @click="openDialog" class="dialog-link" variant="outlined">{{ $t(title) }}</v-btn>
    <v-dialog v-model="dialog" max-width="500px" max-height="500px">
        <v-card>
            <v-card-title>{{ $t(title) }}</v-card-title>
            <v-card-text class="student-list">
                <div v-if="students.length > 0">
                    <v-card-item v-for="(student, index) in students" :key="index">
                        {{ student.given_name + " " + student.surname }}
                    </v-card-item>
                </div>
                <div v-else>
                    {{ $t("group.no_students") }}
                </div>
            </v-card-text>
            <v-card-actions>
                <v-btn @click="closeDialog">{{ $t("group.close") }}</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import User from "@/models/User";
import { ref, toRefs } from "vue";

const props = defineProps<{
    students: User[] | null;
    title: string

}>();

const { students } = toRefs(props);

const dialog = ref(false);

function openDialog() {
    dialog.value = true;
}

function closeDialog() {
    dialog.value = false;
}
</script>

<style scoped>
.student-list {
    overflow-y: auto;
}

.dialog-link {
    margin: 15px;
}

.v-card-padding {
    padding: 5px;
    margin-bottom: 5px;
}

.dialog-link {
    background-color: rgb(var(--v-theme-secondary))
}
</style>
