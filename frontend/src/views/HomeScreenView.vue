<template>
    <v-container v-if="smAndDown">
        <h1 v-if="isLoading">Loading...</h1>
        <h1 v-else class="title">
            {{ $t("home.welcome", { name: user!.given_name, surname: user!.surname }) }}
        </h1>
        <div class="mobileCard">
            <DeadlinesCard />
        </div>
        <div class="mobileCard">
            <SubjectsCard />
        </div>
    </v-container>
    <v-container v-else>
        <h1 v-if="isLoading">Loading...</h1>
        <h1 v-else class="title">
            {{ $t("home.welcome", { name: user!.given_name, surname: user!.surname }) }}
        </h1>
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
import { useUserQuery } from "@/queries/User";
import { useDisplay } from "vuetify";

const { data: user, isLoading } = useUserQuery(null);
const { smAndDown } = useDisplay();
</script>

<style scoped lang="scss">
.title {
    background-color: rgb(var(--v-theme-secondary));
    color: rgb(var(--v-theme-text));
    margin-bottom: 15px;
    margin-top: 15px;
    padding: 10px;
    border-radius: 2px;
}

.mobileCard {
    margin: 15px;
}
</style>
