<template>
    <div class="">
        <h1>My Courses</h1>
        <ul>
            <li
                v-for="subject in subjects"
                :key="subject.id"
            >
                <router-link :to="{ name: 'subject', params: { subjectId: subject.id }, meta: { subjectData: subject}}">
                    {{ subject.name }}
                </router-link>
            </li>

        </ul>
    </div>
</template>

<script setup lang="ts">

import {useAuthStore} from "@/stores/auth-store";
import {onMounted, reactive} from "vue";

interface Subject {
    id: number;
    name: string;
}


const apiUrl = import.meta.env.VITE_API_URL;
const subjects: Subject[] = reactive([]);
const {token, logout} = useAuthStore();

onMounted(async () => {
    await fetchSubjects();
});

async function fetchSubjects() {
    if (!token) {
        return;
    }
    try {
        const response = await fetch(`${apiUrl}/api/subjects`, {
            headers: {Authorization: `${token?.token_type} ${token?.token}`},
        });

        const data = await response.json()
        subjects.splice(0)
        data.subjects.forEach(subject => {
            subjects.push(subject)
        })

    } catch (error) {
        console.error('Error fetching subjects:', error);
    }
}


</script>

<style scoped>

</style>
