<template>
    <v-navigation-drawer>
        <div class="logo">
            <img alt="Logo" class="logo" src="@/assets/logo_white_transparant.png" height="60" />
        </div>
        <v-list-item>
            <v-btn variant="text" class="btn-wrapper">
                <v-icon icon="mdi-school-outline" />
                <span>{{ $t("navigation.courses") }}</span>
                <v-icon class="chevron" icon="mdi-chevron-right" />
            </v-btn>
        </v-list-item>
        <v-list-item>
            <v-btn variant="text" class="btn-wrapper">
                <v-icon icon="mdi-book-check-outline" />
                <span>{{ $t("navigation.projects") }}</span>
                <v-icon class="chevron" icon="mdi-chevron-right" />
            </v-btn>
        </v-list-item>
        <v-list-item>
            <v-btn variant="text" class="btn-wrapper">
                <v-icon icon="mdi-cog-outline" />
                <span>{{ $t("navigation.settings") }}</span>
                <v-icon class="chevron" icon="mdi-chevron-right" />
            </v-btn>
        </v-list-item>
        <v-list-item>
            <v-btn variant="text" class="btn-wrapper">
                <v-icon icon="mdi-help-circle-outline" />
                <span>{{ $t("navigation.help") }}</span>
                <v-icon class="chevron" icon="mdi-chevron-right" />
            </v-btn>
        </v-list-item>
        <div class="ugent-logo">
            <img
                alt="Logo"
                class="logo"
                src="@/assets/universiteit-gent-logo-white.png"
                height="150"
            />
        </div>
    </v-navigation-drawer>
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

const apiUrl = import.meta.env.VITE_API_URL;
const user = ref<string | null>(null);
const { token } = useAuthStore();
onMounted(async () => {
    await fetchUser();
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
.v-navigation-drawer {
    background: linear-gradient(#0e2057, #1e46bd);
}
.logo {
    margin: 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.ugent-logo {
    position: absolute;
    bottom: 0;
    margin-bottom: 20px;
}
.btn-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

.v-icon {
    margin-right: 10px;
}

.chevron {
    position: absolute;
    right: 0;
}

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
