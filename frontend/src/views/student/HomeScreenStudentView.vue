<template>
    <BackgroundContainer>
        <h1 v-if="isLoading">Loading...</h1>
        <h1 v-else>{{ $t("home.welcome", { name: user!.given_name }) }}</h1>
        <v-container>
            <v-row>
                <v-col>
                    <HomeScreenCard title="homescreen.deadlines" />
                </v-col>
                <v-col>
                    <HomeScreenCard title="homescreen.courses" />
                </v-col>
                <v-col>
                    <HomeScreenCard title="homescreen.announcements" />
                </v-col>
            </v-row>
        </v-container>
    </BackgroundContainer>
</template>

<script setup lang="ts">
import HomeScreenCard from "@/components/cards/HomeScreenCard.vue";
import BackgroundContainer from "@/components/BackgroundContainer.vue";
import { useUserQuery } from "@/queries/User";

const { data: user, isLoading } = useUserQuery();
</script>

<style scoped lang="scss">
.h1 {
    margin-bottom: 30px;
}
</style>
