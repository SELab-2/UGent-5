<template>
    <v-img aspect-ratio="16/9" cover rounded="xl" :src="imagePath" class="header-img">
        <SubjectIcon
            :role="role"
            size="xxx-large"
            class="subject-icon"
        ></SubjectIcon>
    </v-img>
</template>

<script setup lang="ts">
import SubjectIcon from "@/components/subject/extra/SubjectIcon.vue";
import { ref } from "vue";
import {SubjectRole} from "@/models/Subject";

defineProps<{
    imagePath: string;
    role: SubjectRole;
}>();

</script>

<style scoped>
.header-img {
    border-radius: 25px;
    height: 165px;
}

.subject-icon {
    position: absolute;
    top: 10px;
    left: 10px;
}
</style>
