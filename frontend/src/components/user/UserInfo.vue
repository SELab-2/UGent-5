<template>
    <h2 v-if="isLoading" class="welcome">Loading...</h2>
    <h2 v-else-if="isError" class="welcome">Error...</h2>
    <div v-else>
        <h2 class="welcome">{{ $t("home.welcome", { name: user.given_name }) }}!</h2>
        <v-switch
            :model-value="user.is_admin"
            label="is_admin"
            @update:modelValue="mutateAsync"
        ></v-switch>
    </div>
</template>

<script setup lang="ts">
import { useUserQuery, useUserMutation } from "@/queries/User";

const { data: user, isLoading, isError } = useUserQuery();
const { mutateAsync } = useUserMutation();
</script>

<style scoped lang="scss">
.welcome {
    margin-top: 50px;
    margin-bottom: 30px;
}
</style>
