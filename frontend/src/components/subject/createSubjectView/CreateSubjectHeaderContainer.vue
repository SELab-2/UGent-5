<template>
    <v-row>
        <v-col cols="4">
            <SubjectsHeaderImage :imagePath="imagePath"></SubjectsHeaderImage>
        </v-col>
        <v-col cols="8">
            <CreateSubjectHeaderCard>

            </CreateSubjectHeaderCard>
        </v-col>
    </v-row>
</template>



<script setup lang="ts">

import SubjectsHeaderImage from "@/components/subject/extra/SubjectsHeaderImage.vue";
import CreateSubjectHeaderCard from "@/components/subject/createSubjectView/CreateSubjectHeaderCard.vue";

defineProps<{
    imagePath: string;
}>();
</script>

<style scoped>

</style>
