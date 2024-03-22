<template>
    <h1>Subject</h1>
    <h2>{{ subjectId }}</h2>

</template>

<script setup lang="ts">

import {defineProps} from "vue";
import {useAuthStore} from "@/stores/auth-store";
import {onMounted, reactive} from "vue";

const props = defineProps(['subjectId'])

interface Teacher {
    "uid": "string",
    "given_name": "string",
    "mail": "string",
    "is_admin": false
}


const subject = reactive({
    id: -1 as Number,
    name: "" as String,
    teachers: [] as Teacher[]
})
const apiUrl = import.meta.env.VITE_API_URL;
const {token, logout} = useAuthStore();

onMounted(async () => {
    await fetchSubject();
});

async function fetchSubject() {
    if (!token) {
        return;
    }
    try {
        console.log("kak")
        const [name, teachers] = await Promise.all([
            fetchSubjectName(),
            fetchSubjectTeachers()
        ]);

        subject.id = props.subjectId;
        subject.name = name;
        subject.teachers = teachers;

    } catch (error) {
        console.error('Error fetching subjects:', error);
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




</script>

<style scoped>

</style>
