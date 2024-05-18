<template>
    <v-icon color="white" :size="size">
        {{ `mdi-${userRole}` }}
    </v-icon>
</template>

<script setup lang="ts">
import { SubjectRole } from "@/models/Subject";
import { computed, toRefs } from "vue";

const props = defineProps<{
    role: SubjectRole;
    size: string;
}>();

const { role } = toRefs(props);

const userRole = computed(() => {
    if (role.value === SubjectRole.Instructor) return "account-tie";
    if (role.value === SubjectRole.Student) return "school";
    if (role.value === SubjectRole.Admin) return "security";
    return "cancel";
});
</script>

<style scoped></style>
