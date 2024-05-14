<template>
    <v-card class="v-card-padding">
        <div @click="openDialog" class="dialog-link">{{ $t("group.all_students") }}</div>
    </v-card>
    <v-dialog v-model="dialog" max-width="500px" max-height="500px">
        <v-card>
            <v-card-title>{{ $t("group.all_students_course") }}</v-card-title>
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
                <v-btn color="primary" @click="closeDialog">{{ $t("group.close") }}</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import User from "@/models/User";
import { ref, toRefs } from "vue";

const props = defineProps<{
    students: User[] | null;
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
    cursor: pointer;
    color: blue;
    text-decoration: underline;
}
.v-card-padding {
    padding: 5px;
    margin-bottom: 5px;
}
</style>
