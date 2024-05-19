<template>
    <v-row>
        <v-col cols="4">
            <CreateSubjectHeaderImage :imagePath="imagePath"></CreateSubjectHeaderImage>
        </v-col>
        <v-col cols="8">
            <CreateSubjectHeaderCard>

            </CreateSubjectHeaderCard>
        </v-col>
    </v-row>
</template>



<script setup lang="ts">

import CreateSubjectHeaderCard from "@/components/subject/createSubjectView/header/CreateSubjectHeaderCard.vue";
import CreateSubjectHeaderImage from "@/components/subject/createSubjectView/header/CreateSubjectHeaderImage.vue";

defineProps<{
    imagePath: string;
}>();
</script>

<style scoped>

</style>
