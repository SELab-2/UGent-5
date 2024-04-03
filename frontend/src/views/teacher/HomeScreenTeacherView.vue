<template>
    <BackgroundContainer>
        <h1>{{ $t("home.welcome", { name: user }) }}</h1>
        <v-container>
            <v-row>
                <v-col>
                    <HomeScreenCard title="" />
                </v-col>
                <v-col>
                    <HomeScreenCard title="" />
                </v-col>
                <v-col>
                    <HomeScreenCard title="" />
                </v-col>
            </v-row>
        </v-container>
    </BackgroundContainer>
</template>

<script setup lang="ts">
</script>

<style scoped>

</style>
