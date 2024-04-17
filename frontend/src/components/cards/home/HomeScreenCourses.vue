<template>
    <v-divider></v-divider>
    <div class="coursebtn" @click="navigateToCourse">
        <div>
            <h3>{{ name }}</h3>
            <p class="teacher">{{ teacher }}</p>
        </div>
        <v-icon class="chevron" icon="mdi-chevron-right" />
    </div>
</template>

<script setup lang="ts">
import router from "@/router";

const props = defineProps<{
    id: number;
    name: string;
    teacher: string;
}>();

const navigateToCourse = () => {
    router.push(`/subjects/${props.id}`);
};
</script>

<style scoped>
.coursebtn {
    width: 100%;
    background-color: white;
    padding: 10px;
    display: flex;
    align-items: center;
    transition: background-color 0.3s;
    cursor: pointer;
}

.coursebtn:hover {
    background-color: lightgray;
}

.chevron {
    margin-right: 20px;
    position: absolute;
    right: 0;
}

.teacher {
    color: lightslategrey;
}
</style>
