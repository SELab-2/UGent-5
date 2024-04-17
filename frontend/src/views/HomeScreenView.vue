<template>
    <BackgroundContainer>
        <h1 v-if="isLoading">Loading...</h1>
        <h1 v-else>{{ $t("home.welcome", { name: user!.given_name }) }}</h1>
        <v-container v-if="smAndDown">
            <div class="mobileCard">
                <HomeScreenCard :title="'homescreen.deadlines'" :data="[]" type="deadlines" />
            </div>
            <div class="mobileCard">
                <HomeScreenCard :title="'homescreen.subjects'" :data="[]" type="subjects" />
            </div>
            <div class="mobileCard">
                <HomeScreenCard :title="'homescreen.announcements'" :data="[]" type="announcements" />
            </div>
        </v-container>
        <v-container v-else>
            <v-row>
                <div>
                    <HomeScreenCard :title="'homescreen.deadlines'" :data="deadlines" type="deadlines" />
                </div>
                <div>
                    <HomeScreenCard :title="'homescreen.subjects'" :data="courses" type="subjects" />
                </div>
                <div>
                    <HomeScreenCard :title="'homescreen.announcements'" :data="[]" type="announcements" />
                </div>
            </v-row>
        </v-container>
    </BackgroundContainer>
</template>

<script setup lang="ts">
import HomeScreenCard from "@/components/cards/home/HomeScreenCard.vue";
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

const deadlines = [
    { id: 1, name: 'project A', course: 'course A', deadline: new Date(2024, 4, 28, 23, 59), status: 'none' },
    { id: 2, name: 'project B', course: 'course B', deadline: new Date(2024, 6, 2, 17, 0), status: 'accepted' },
    { id: 3, name: 'project C', course: 'course C', deadline: new Date(2024, 5, 5, 22, 0), status: 'rejected' },
];

</script>

<style scoped lang="scss">
.h1 {
    margin-bottom: 30px;
}

.mobileCard {
    margin: 15px;
}
</style>
