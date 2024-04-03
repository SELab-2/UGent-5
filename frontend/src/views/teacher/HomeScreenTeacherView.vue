<template>
    <BackgroundContainer>
        <h1>{{ $t("home.welcome", { name: user }) }}</h1>
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
import BackgroundContainer from "@/components/BackgroundContainer.vue"
import HomeScreenCard from "@/components/cards/HomeScreenCard.vue"
</script>

<style scoped>

</style>
