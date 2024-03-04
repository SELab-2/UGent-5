<template>
    <div>
        <h2>Welkom, {{ user }}!</h2>
        <a :href="apiUrl + '/logout'"> logout </a>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
const apiUrl = import.meta.env.VITE_API_URL;
const user = ref<string>('');
onMounted(async () => {
    await fetchUser();
});

async function fetchUser() {
    try {
        await fetch(`${apiUrl}/profile`, {
            credentials: 'include',
        }).then((data) => {
            data.json().then((userObj) => (user.value = userObj.user.user));
        });
    } catch (error) {
        console.error(error);
    }
}
</script>

<style></style>
