<template>
    <div class="logout">
        <h2>Welkom, {{ user }}!</h2>
        <a class="logout-button" :href="apiUrl + '/logout'"> logout </a>
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
        })
            .then((data) => data.json())
            .then((userObj) => {
                user.value = userObj.given_name;
            });
    } catch (error) {
        console.error(error);
    }
}
</script>

<style scoped>
.logout {
    --secondary-bg-color: #797d7f;
    --tertiary-bg-color: #a6acaf;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    text-align: center;
}

.logout h2 {
    margin-bottom: 30px;
}

.logout-button {
    background-color: var(--secondary-bg-color);
    color: white;
    border: 2px solid white;
    padding: 10px 20px;
    font-size: 16px;
    border-radius: 50px;
    cursor: pointer;
    transition:
        background-color 0.3s,
        color 0.3s;
}

.logout-button:hover {
    background-color: var(--tertiary-bg-color);
    color: white;
}
</style>
