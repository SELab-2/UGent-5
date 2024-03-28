<template>
    <homeScreenNav :navigations="navigations"/>
    <div class="content">
        <h1>{{ $t("home.welcome", { name: user }) }}</h1>
        <v-container>
            <v-row>
                <v-col>
                    <v-card variant="text" :title="$t('homescreen.deadlines')"> </v-card>
                </v-col>
                <v-col>
                    <v-card variant="text" :title="$t('homescreen.courses')"> </v-card>
                </v-col>
                <v-col>
                    <v-card variant="text" :title="$t('homescreen.announcements')"> </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth-store";
import { ref, onMounted } from "vue";
import HomeScreenNav from "@/components/navigation/HomeScreenNav.vue"

const navigations = ref([
    { icon: 'mdi-school-outline', title: "navigation.courses"},
    { icon: 'mdi-book-check-outline', title: "navigation.projects" },
    { icon: 'mdi-cog-outline', title: "navigation.settings" },
    { icon: 'mdi-help-circle-outline', title: "navigation.help" }
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
.content {
    padding: 20px;
    height: 100vh;
    border: 25px solid white;
    border-radius: 50px;
    background-color: var(--color-secondary);
}

.content h1 {
    margin-bottom: 30px;
}

.v-card {
    background-color: white;
    color: black;
    border-radius: 20px;
}

.v-card h1 {
    margin: 15px;
}
</style>
