<template>
    <h1 v-if="isLoading">Loading...</h1>
    <h1 v-else class="title">{{ $t("home.welcome", { name: user!.given_name }) }}</h1>
    <v-container v-if="smAndDown">
        <div class="mobileCard">
            <DeadlinesCard />
        </div>
        <div class="mobileCard">
            <SubjectsCard />
        </div>
        <div class="mobileCard">
            <AnnouncementsCard />
        </div>
    </v-container>
    <v-container v-else>
        <v-row>
            <v-col>
                <DeadlinesCard />
            </v-col>
            <v-col>
                <SubjectsCard />
            </v-col>
            <v-col>
                <AnnouncementsCard />
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import SubjectsCard from "@/components/home/cards/SubjectsCard.vue";
import DeadlinesCard from "@/components/home/cards/DeadlinesCard.vue";
import AnnouncementsCard from "@/components/home/cards/AnnouncementsCard.vue";
import BackgroundContainer from "@/components/BackgroundContainer.vue";
import { useUserQuery } from "@/queries/User";
import { useDisplay } from "vuetify";

const { data: user, isLoading } = useUserQuery(null);
const { smAndDown } = useDisplay();
</script>

<style scoped lang="scss">
.title {
    margin: 30px;
}

.mobileCard {
    margin: 15px;
}
</style>
