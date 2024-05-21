<template>
    <div class="info">
        <TitleContainer :title="$t('about.about')" class="titlecontainer">
            <p>
                {{ $t("about.p_1") }}
                <a href="https://studiekiezer.ugent.be/2023/studiefiche/nl/C003784" class="link">
                    Software Engineering Lab 2 </a
                >. {{ $t("about.p_2") }}
                <a href="https://github.com/SELab-2/UGent-5" class="link"> GitHub </a>.
            </p>
        </TitleContainer>
        <h2>{{ $t("about.developers") }}:</h2>
        <v-list lines="one">
            <v-list-item v-for="developer in developers" :key="developer.name" class="developers">
                <template v-slot:title>
                    <v-btn :href="developer.githubUrl" variant="flat">{{ developer.name }}</v-btn>
                </template>
                <template v-slot:subtitle>
                    {{ developer.role }}
                </template>
            </v-list-item>
        </v-list>
    </div>
</template>

<script setup lang="ts">
import TitleContainer from "@/components/TitleContainer.vue";
interface Developer {
    role: string;
    name: string;
    githubUrl: string;
}
const developers: Developer[] = [
    {
        role: "Project Lead",
        name: "Marieke Sinnaeve",
        githubUrl: "https://github.com/masinnae",
    },
    {
        role: "Technical Lead",
        name: "Bram Reyniers",
        githubUrl: "https://github.com/reyniersbram",
    },
    {
        role: "System Administrator",
        name: "Xander Bil",
        githubUrl: "https://github.com/xerbalind",
    },
    {
        role: "Custom Relations Officer + Documentation",
        name: "Pieter Janin",
        githubUrl: "https://github.com/pieterjanin",
    },
    {
        role: "Frontend Manager",
        name: "Mattis Cauwel",
        githubUrl: "https://github.com/mattiscauwel",
    },
    {
        role: "Backend Manager",
        name: "Dries Hyubens",
        githubUrl: "https://github.com/DRIESASTER",
    },
    {
        role: "Test Manager",
        name: "Michaël Boelaert",
        githubUrl: "https://github.com/miboelae",
    },
];
</script>
<style scoped>
.info {
    padding: 30px;
    margin-left: 25px;
    margin-top: 10px;
    margin-right: 25px;
}

.link {
    color: white;
}

.about {
    margin-bottom: 25px;
    background-color: rgb(var(--v-theme-secondary));
    padding: 15px;
}

.v-btn {
    background-color: rgb(var(--v-theme-secondary));
}

.developers {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
}

.titlecontainer {
    margin-bottom: 30px;
}
</style>
