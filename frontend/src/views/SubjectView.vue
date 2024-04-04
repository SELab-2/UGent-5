<template>
    <div class="v-container">
        <router-link to="/subjects">Back</router-link>
        <div v-if="!loading" class="v-container rounded bg-white pa-5 align-center">
            <div class="v-container">
                <h1>{{ subject.name }}</h1>
                <h3>Academy year...</h3>
                <div>
                    <p
                        v-if="subject.teachers.length === 0"
                    >No teachers available</p>
                    <p
                        v-else
                        v-for="teacher in subject.teachers"
                        :key="teacher.uid"
                    >{{ teacher.given_name }}</p>
                </div>
            </div>
            <div class="v-container">
                <h2>Projects</h2>
                <ul>
                    <li
                        v-for="project in subject.projects"
                        :key="project.id"
                    >
                        <div class="v-container">
                            <h2>{{project.name}}</h2>
                            <p>{{project.deadline}}</p>
                            <router-link :to="`/projects/${project.id}}`" >To Project</router-link>
                        </div>
                    </li>
                </ul>

            </div>
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

import {defineProps, ref} from "vue";
import {useAuthStore} from "@/stores/auth-store";
import {onMounted, reactive} from "vue";
import type User from "@/models/User";
import type Project from "@/models/Project";

const props = defineProps(['subjectId'])


const subject = reactive({
    id: props.subjectId as Number,
    name: String,
    teachers: [] as User[],
    students: [] as User[],
    projects: [] as Project[]
})
const apiUrl = import.meta.env.VITE_API_URL;
const {token, logout} = useAuthStore();

const loading = ref(true);
const error = ref("");

onMounted(async () => {
    await fetchSubject();
});

async function fetchSubject() {
    if (!token) {
        return;
    }
    try {
        loading.value = true
        const [name, teachers, students, projects] = await Promise.all([
            fetchSubjectName(),
            fetchSubjectTeachers(),
            fetchSubjectStudents(),
            fetchSubjectProjects()
        ]);

        subject.name = name;
        subject.teachers = teachers;
        subject.students = students;
        subject.projects = projects;
        loading.value = false
    } catch (err) {
        error.value = err.message || "Unknown Error"
        console.error('Error fetching subjects:', err);
        loading.value = false
    }
}

async function fetchSubjectName() {
    const response = await fetch(`${apiUrl}/api/subjects/${props.subjectId}`, {
        headers: {Authorization: `${token?.token_type} ${token?.token}`},
    });

    const data = await response.json()
    return data?.name
}

async function fetchSubjectTeachers() {
    const response = await fetch(`${apiUrl}/api/subjects/${props.subjectId}/teachers`, {
        headers: {Authorization: `${token?.token_type} ${token?.token}`},
    });

    return await response.json()
}

async function fetchSubjectStudents() {
    const response = await fetch(`${apiUrl}/api/subjects/${props.subjectId}/students`, {
        headers: {Authorization: `${token?.token_type} ${token?.token}`},
    });

    return await response.json()
}

async function fetchSubjectProjects() {
    const response = await fetch(`${apiUrl}/api/subjects/${props.subjectId}/projects`, {
        headers: {Authorization: `${token?.token_type} ${token?.token}`},
    });
    const data = await response.json()
    return data.projects
}


</script>

<style scoped>

</style>
