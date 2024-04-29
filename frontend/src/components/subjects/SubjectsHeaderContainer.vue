<template>
    <v-row>
        <v-col cols="6">
            <SubjectsHeaderCard :is-loading="isLoading"></SubjectsHeaderCard>
        </v-col>
        <v-col>
            <SubjectHeaderImage
                image-path="https://www.ugent.be/img/dcom/faciliteiten/ufo-logo.png"></SubjectHeaderImage>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import SubjectsHeaderCard from "@/components/subjects/SubjectsHeaderCard.vue";
import SubjectHeaderImage from "@/components/subject/header/SubjectHeaderImage.vue";

defineProps<{
    isLoading: boolean;
}>();
</script>

<style scoped>


</style>
