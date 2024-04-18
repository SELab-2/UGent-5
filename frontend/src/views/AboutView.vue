<template>
    <div>
        <h1>Over dit project</h1>
        <p>
            Dit project is gemaakt in het kader van het vak
            <a href="https://studiekiezer.ugent.be/2023/studiefiche/nl/C003784">
                Software Engineering Lab 2 </a
            >. De broncode is publiek beschikbaar op
            <a href="https://github.com/SELab-2/UGent-5"> GitHub </a>.
        </p>
        <h2>Onze Developers:</h2>
        <v-list lines="one">
            <v-list-item v-for="developer in developers" :key="developer.name">
                <template v-slot:title>
                    <v-btn :href="developer.githubUrl">{{ developer.name }}</v-btn>
                </template>
                <template v-slot:subtitle>
                    {{ developer.role }}
                </template>
            </v-list-item>
        </v-list>
    </div>
</template>

<script setup lang="ts">
interface Developer {
    role: string;
    name: string;
    githubUrl: string;
}
const developers: Developer[] = [
    {
        role: "Projectleider",
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
