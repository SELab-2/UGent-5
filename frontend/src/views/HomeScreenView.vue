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
                <HomeScreenSkeletonCard v-if="isSubjectsLoading"/>
                <HomeScreenCard v-else :title="'homescreen.subjects'">
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
                <v-col>
                    <HomeScreenCard :title="'homescreen.deadlines'">
                        <HomeScreenDeadlines
                            v-for="deadline in deadlines"
                            :deadline="deadline"
                            :key="deadline.project.id"
                        />
                    </HomeScreenCard>
                </v-col>
                <v-col>
                    <HomeScreenCard :title="'homescreen.subjects'">
                        <HomeScreenCourses
                            v-for="subject in subjects"
                            :subject="subject"
                            :key="subject.id"
                        />
                    </HomeScreenCard>
                </v-col>
                <v-col>
                    <HomeScreenCard :title="'homescreen.announcements'" />
                </v-col>
            </v-row>
        </v-container>
    </BackgroundContainer>
</template>

<script setup lang="ts">
import HomeScreenCard from "@/components/cards/home/HomeScreenCard.vue";
import HomeScreenSkeletonCard from "@/components/cards/home/HomeScreenSkeletonCard.vue";
import HomeScreenDeadlines from "@/components/buttons/HomeScreenDeadlines.vue";
import HomeScreenCourses from "@/components/cards/home/HomeScreenCourses.vue";
import BackgroundContainer from "@/components/BackgroundContainer.vue";
import { useUserQuery } from "@/queries/User";
import { useDisplay } from "vuetify";
import { type Deadline } from "@/models/Project";
import { ref } from "vue";
import { useSubjectsQuery } from "@/queries/Subject"

const { data: user, isLoading } = useUserQuery(null);
const { smAndDown } = useDisplay();

const {data: subjects, isLoading: isSubjectsLoading, isError: isSubjectsError} = useSubjectsQuery();

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
