<template>
    <h2 class="welcome">{{ $t("home.welcome", { name: user }) }}!</h2>
</template>

<script setup lang="ts">
import { getUser } from "@/helpers/datafetchers/User";
const user = await getUser().then((user) => user.given_name);
</script>

<style scoped lang="scss">
.welcome {
    margin-top: 50px;
    margin-bottom: 30px;
}
</style>
