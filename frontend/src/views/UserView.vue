<template>
    <div>
        <h2>test</h2>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
const user = ref<string>('');
onMounted(async () => {
    await fetchUser();
});

async function fetchUser() {
    try {
        await fetch(`${import.meta.env.VITE_API_URL}/profile`, {
            credentials: 'include',
        }).then((data) => {
            data.json().then((userObj) => (user.value = userObj.user.user));
        });
    } catch (error) {
        console.error(error);
    }
}
</script>
