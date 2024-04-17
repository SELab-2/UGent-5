<template>
    <BackgroundContainer>
        <h1 v-if="isLoading">Loading...</h1>
        <h1 v-else>{{ $t("home.welcome", { name: user!.given_name }) }}</h1>
        <v-container v-if="smAndDown">
            <div class="mobileCard">
                <HomeScreenCard :title="'homescreen.deadlines'">
                    <HomeScreenDeadlines
                        v-for="deadline in deadlines"
                        :deadline="deadline"
                        :key="deadline.project.id"
                    />
                </HomeScreenCard>
            </div>
            <div class="mobileCard">
                <HomeScreenCard :title="'homescreen.subjects'">
                    <HomeScreenCourses
                        v-for="subject in subjects"
                        :subject="subject"
                        :key="subject.id"
                    />
                </HomeScreenCard>
            </div>
            <div class="mobileCard">
                <HomeScreenCard :title="'homescreen.announcements'" />
            </div>
        </v-container>
        <v-container v-else>
            <v-row>
                <div>
                    <HomeScreenCard :title="'homescreen.deadlines'">
                        <HomeScreenDeadlines
                            v-for="deadline in deadlines"
                            :deadline="deadline"
                            :key="deadline.project.id"
                        />
                    </HomeScreenCard>
                </div>
                <div>
                    <HomeScreenCard
                        :title="'homescreen.subjects'"
                        :data="subjects"
                        type="subjects"
                    />
                </div>
                <div>
                    <HomeScreenCard
                        :title="'homescreen.announcements'"
                        :data="[]"
                        type="announcements"
                    />
                </div>
            </v-row>
        </v-container>
    </BackgroundContainer>
</template>

<script setup lang="ts">
import HomeScreenCard from "@/components/cards/home/HomeScreenCard.vue";
import HomeScreenDeadlines from "@/components/buttons/HomeScreenDeadlines.vue";
import HomeScreenCourses from "@/components/cards/home/HomeScreenCourses.vue";
import BackgroundContainer from "@/components/BackgroundContainer.vue";
import { useUserQuery } from "@/queries/User";
import { useDisplay } from "vuetify";
import { type Deadline } from "@/models/Project";
import type Subject from "@/models/Subject";
import { ref } from "vue";

const { data: user, isLoading } = useUserQuery(null);
const { smAndDown } = useDisplay();

const subjects: Subject[] = [
    { id: 1, name: "course A" },
    { id: 2, name: "course B" },
    { id: 3, name: "course C" },
];

const deadlines = ref<Deadline[]>([
    {
        project: {
            id: 1,
            name: "project A",
            subject_id: 1,
            deadline: new Date(2024, 4, 28, 23, 59),
            description: "a description",
        },
        status: "none",
    },
    {
        project: {
            id: 2,
            name: "project B",
            subject_id: 2,
            deadline: new Date(2024, 6, 2, 17, 0),
            description: "another description",
        },
        status: "accepted",
    },
    {
        project: {
            id: 3,
            name: "project C",
            subject_id: 3,
            deadline: new Date(2024, 5, 5, 22, 0),
            description: "last description",
        },
        status: "rejected",
    },
]);
</script>

<style scoped lang="scss">
.h1 {
    margin-bottom: 30px;
}

.mobileCard {
    margin: 15px;
}
</style>
