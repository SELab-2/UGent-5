<template>
    <div class="v-container">
        <h1>My Courses</h1>

        <div
            class="v-container"
            v-if="!loading"
        >
            <ul class="pa-5">
                <li
                    v-for="subject in subjects"
                    :key="subject.id"
                >
                    <router-link :to="{ name: 'subject', params: { subjectId: subject.id }}">
                        {{ subject.name }}
                    </router-link>
                </li>

            </ul>
        </div>

        <div v-else-if="error" class="v-container">
            <p>Error: {{ error }}</p>
        </div>
        <div v-else class="v-container">
            <p>Loading...</p>
        </div>
    </div>
</template>

<script setup lang="ts">

import {useAuthStore} from "@/stores/auth-store";
import {onMounted, reactive, ref} from "vue";

interface Subject {
    id: number;
    name: string;
}


const apiUrl = import.meta.env.VITE_API_URL;
const subjects: Subject[] = reactive([]);
const {token, logout} = useAuthStore();

const loading = ref(true);
const error = ref("");

onMounted(async () => {
    await fetchSubjects();
});

async function fetchSubjects() {
    if (!token) {
        return;
    }
    try {
        loading.value = true;
        const response = await fetch(`${apiUrl}/api/subjects`, {
            headers: {Authorization: `${token?.token_type} ${token?.token}`},
        });

        const data = await response.json()
        subjects.splice(0)
        data.subjects.forEach(subject => {
            subjects.push(subject)
        })
        loading.value = false;
    } catch (err) {
        error.value = err.message
        console.error('Error fetching subjects:', err);
    }
}


</script>

<style scoped>

</style>
