<template>
    <v-container v-if="smAndDown">
        <h1 v-if="isLoading">Loading...</h1>
        <TitleContainer v-else :title="$t('home.welcome', { name: user!.given_name, surname: user!.surname })"></TitleContainer>
        <div class="mobileCard">
            <DeadlinesCard />
        </div>
        <div class="mobileCard">
            <SubjectsCard />
        </div>
    </v-container>
    <v-container v-else>
        <h1 v-if="isLoading">Loading...</h1>
        <TitleContainer v-else :title="$t('home.welcome', { name: user!.given_name, surname: user!.surname })" class="title"></TitleContainer>
        <v-row>
            <v-col>
                <DeadlinesCard />
            </v-col>
            <v-col>
                <SubjectsCard />
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import SubjectsCard from "@/components/home/cards/SubjectsCard.vue";
import DeadlinesCard from "@/components/home/cards/DeadlinesCard.vue";
import AnnouncementsCard from "@/components/home/cards/AnnouncementsCard.vue";
import TitleContainer from "@/components/TitleContainer.vue";
import { useCurrentUserQuery } from "@/queries/User";
import { useDisplay } from "vuetify";

const { data: user, isLoading } = useCurrentUserQuery();
const { smAndDown } = useDisplay();
</script>

<style scoped lang="scss">
.title {
    margin-bottom: 15px;
    margin-top: 30px;
}

.mobileCard {
    margin: 15px;
}
</style>
