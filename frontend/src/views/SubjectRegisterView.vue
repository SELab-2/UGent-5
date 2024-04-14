<template>
    <BackgroundContainer>
    <v-container align="center">
        <h1> {{ $t("subject.register" )}} </h1>
        <v-row justify="center" >
            <v-btn variant="text" class="register" @click="refetch"> Ok </v-btn>
            <!-- <v-btn variant="text" class="cancel" @click="logout"> Cancel </v-btn> -->
        </v-row>
    </v-container>
    </BackgroundContainer>
</template>

<script setup lang="ts">
import BackgroundContainer from "@/components/BackgroundContainer.vue";
import { registerSubjectQuery } from "@/queries/Subject";
const props = defineProps<{
    uuid: string;
}>();

const { refetch } = registerSubjectQuery(props.uuid);

</script>

<style scoped lang="scss">
.h1 {
    margin-bottom: 30px;
}
</style>
