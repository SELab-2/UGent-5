<template>
    <v-row>
        <v-col cols="4">
            <ModifySubjectHeaderImage :imagePath="imagePath"></ModifySubjectHeaderImage>
        </v-col>
        <v-col cols="8">
            <ModifySubjectHeaderCard
                :title="title"
                :subject-name="subjectName"
                :academic-year="academicYear"
                :subject-mail="subjectMail"
                :current-user-as-instructor="currentUserAsInstructor"
                :is-subject-name-error="isSubjectNameError"
                :is-subject-mail-error="isSubjectMailError"
                @update:subject-name="$emit('update:subject-name', $event)"
                @update:active-academic-year="$emit('update:active-academic-year', $event)"
                @update:subject-mail="$emit('update:subject-mail', $event)"
                @update:current-user-as-instructor="
                    $emit('update:current-user-as-instructor', $event)
                "
            >
            </ModifySubjectHeaderCard>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import ModifySubjectHeaderCard from "@/components/subject/modify/header/ModifySubjectHeaderCard.vue";
import ModifySubjectHeaderImage from "@/components/subject/modify/header/ModifySubjectHeaderImage.vue";

defineProps<{
    title: string;
    imagePath: string;
    subjectName: string,
    academicYear: number,
    subjectMail: string,
    currentUserAsInstructor: boolean;
    isSubjectNameError: boolean;
    isSubjectMailError: boolean;
}>();

defineEmits<{
    (e: "update:current-user-as-instructor", value: boolean): void;
    (e: "update:subject-name", value: string): void;
    (e: "update:subject-mail", value: string): void;
    (e: "update:active-academic-year", value: number): void;
}>();
</script>

<style scoped></style>
