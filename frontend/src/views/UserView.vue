<template>
    <div>
        <h1>{{ user }}</h1>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, type Ref } from "vue";
const user: Ref<string> = ref("");
onMounted(async () => {
    await fetchUser();
})

async function fetchUser() {
    try {
        await fetch("https://localhost:8080/profile", {
            credentials: "include",
        }).then(data => { data.json().then(userObj => user.value = userObj.user.user) });
    } catch (error) {
        console.error(error);
    }
}
</script>
