<template>
    <BackgroundContainer>
        <h1 v-if="isLoading">Loading...</h1>
        <h1 v-else>{{ $t("home.welcome", { name: user!.given_name }) }}</h1>
        <v-container v-if="smAndDown">
            <div v-for="card in cards" class="mobileCards" :key="card.title">
                <HomeScreenCard :title="card.title" :data="card.data" :type="card.type"/>
            </div>
        </v-container>
        <v-container v-else>
            <v-row>
                <v-col v-for="card in cards" :key="card.title">
                    <HomeScreenCard :title="card.title" :data="card.data" :type="card.type"/>
                </v-col>
            </v-row>
        </v-container>
    </BackgroundContainer>
</template>

<script setup lang="ts">
import HomeScreenCard from "@/components/cards/HomeScreenCard.vue";
import BackgroundContainer from "@/components/BackgroundContainer.vue";
import { useUserQuery } from "@/queries/User";
import { useDisplay } from "vuetify";

const { data: user, isLoading } = useUserQuery(null);
const { smAndDown } = useDisplay();

const courses = [
    { id: 1, name: 'course A', teacher: "peter" },
    { id: 2, name: 'course B', teacher: "eric" },
    { id: 3, name: 'course C', teacher: "chris" },
];

const cards = [
    { title: "homescreen.deadlines", data: [] , type:"deadlines" },
    { title: "homescreen.courses", data: courses, type: "courses" },
    { title: "homescreen.announcements", data: [], type: "announcements" },
];



</script>

<style scoped lang="scss">
.h1 {
    margin-bottom: 30px;
}

.mobileCards {
    margin: 15px;
}
</style>
