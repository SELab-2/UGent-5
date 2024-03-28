<template>
    <homeScreenNav :navigations="navigations"/>
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
import { useAuthStore } from "@/stores/auth-store";
import { ref, onMounted } from "vue";
import HomeScreenNav from "@/components/navigation/HomeScreenNav.vue"
import HomeScreenCard from "@/components/cards/HomeScreenCard.vue"
import BackgroundContainer from "@/components/BackgroundContainer.vue"

const navigations = ref([
    { icon: 'mdi-school-outline', title: "navigation.courses"},
    { icon: 'mdi-book-check-outline', title: "navigation.projects" },
    { icon: 'mdi-cog-outline', title: "navigation.settings" },
]);

const apiUrl = import.meta.env.VITE_API_URL;
const user = ref<string | null>(null);
const { token } = useAuthStore();
onMounted(async () => {
    await fetchUser();
    console.log(navigations)
    console.log("test")
});

async function fetchUser() {
    if (!token) {
        return;
    }
    await fetch(`${apiUrl}/api/users/me`, {
        headers: { Authorization: `${token?.token_type} ${token?.token}` },
    })
        .then((data) => data.json())
        .then((userObj) => {
            user.value = userObj.given_name;
        })
        .catch((error) => console.log(error));
}
</script>

<style scoped lang="scss">


.h1 {
    margin-bottom: 30px;
}


</style>
