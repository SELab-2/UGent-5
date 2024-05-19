<template>
    <v-row>
        <v-col cols="4">
            <CreateSubjectHeaderImage :imagePath="imagePath"></CreateSubjectHeaderImage>
        </v-col>
        <v-col cols="8">
            <CreateSubjectHeaderCard
                :current-user-as-instructor="currentUserAsInstructor"
                @update:current-user-as-instructor="$emit('update:currentUserAsInstructor', $event)"
            >
            </CreateSubjectHeaderCard>
        </v-col>
    </v-row>
</template>



<script setup lang="ts">

import CreateSubjectHeaderCard from "@/components/subject/createSubjectView/header/CreateSubjectHeaderCard.vue";
import CreateSubjectHeaderImage from "@/components/subject/createSubjectView/header/CreateSubjectHeaderImage.vue";

defineProps<{
    imagePath: string;
    currentUserAsInstructor: boolean;
}>();

const emit = defineEmits<{
    (e: "set-current-user-as-instructor", value: boolean): void;
    (e: "update:currentUserAsInstructor", value: boolean): void;
}>();

</script>

<style scoped>

</style>
