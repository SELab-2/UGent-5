<template>
    <v-card variant="text" :title="$t(title)" class="card">
        <div v-if="isCourse">
            <HomeScreenCourses
                v-for="d in data"
                v-bind:key="d.id"
                :id="d.id"
                :name="d.name"
                :teacher="d.teacher"
            />
        </div>
        <div v-if="isDeadline">
            <HomeScreenDeadlines
                v-for="d in data"
                v-bind:key="d.id"
                :id="d.id"
                :name="d.name"
                :course="d.course"
                :deadline="d.deadline"
                :status="d.status"
            />
        </div>
    </v-card>
</template>

<script setup lang="ts">
import HomeScreenCourses from "@/components/buttons/HomeScreenCourses.vue";
import HomeScreenDeadlines from "@/components/buttons/HomeScreenDeadlines.vue";
import {ref} from "vue";

const props = defineProps<{
    title: string;
    data: Array<any>
    type: string
}>();

const isCourse = ref(false)
const isDeadline = ref(false)
if(props.type === "courses"){
    isCourse.value = true
} else if(props.type === "deadlines"){
    isDeadline.value = true
}

</script>

<style scoped>
.card {
    background-color: white;
    color: black;
    border-radius: 20px;
}
</style>
