<template>
    <div>
        <v-btn @click="sendEmail" prepend-icon="mdi-email">
            {{ $t("project.needhelp_button") }}
        </v-btn>
    </div>
</template>

<script setup lang="ts">

import {toRefs} from "vue";

const props = defineProps<{
    email: string;
}>();

const { email } = toRefs(props);

function sendEmail(): void {
    window.location.href = `mailto:${email.value}`;
}

</script>

<style scoped>

</style>
