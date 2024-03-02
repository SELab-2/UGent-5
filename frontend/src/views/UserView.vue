<template>
    <div>
        <h1>{{ user }}</h1>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, type Ref } from "vue";
const user: Ref<string> = ref("");
onMounted(async () => {
    user.value = await fetchUser();
})

async function fetchUser() {
    try {
        const response = await fetch("https://localhost:8080/profile", {
            credentials: "include",
        });
        const user = await response.json()
        console.log(user.user.user)
        return user.user.user
    } catch (error) {
        console.error(error)
        return "oei"
    }
}
</script>
