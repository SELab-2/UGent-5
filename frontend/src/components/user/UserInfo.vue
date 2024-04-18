<template>
    <h2 class="welcome">{{ $t("home.welcome", { name: user.given_name }) }}!</h2>
    <v-switch
        :model-value="user.is_admin"
        label="is_admin"
        @update:modelValue="(value) => emit('toggleAdmin', value!)"
    ></v-switch>
</template>

<script setup lang="ts">
import type User from "@/models/User";
import { toRefs } from "vue";

const props = defineProps<{
    user: User;
}>();
const emit = defineEmits<{
    (e: "toggleAdmin", value: boolean): void;
}>();

const { user } = toRefs(props);
</script>

<style scoped lang="scss">
.welcome {
    margin-top: 50px;
    margin-bottom: 30px;
}
</style>
