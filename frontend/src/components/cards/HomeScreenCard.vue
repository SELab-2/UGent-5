<template>
    <v-card variant="text" :title="$t(title)">
        <HomeScreenCourses
            :v-if="isCourse"
            v-for="d in data"
            v-bind:key="d.id"
            :id="d.id"
            :name="d.name"
            :teacher="d.teacher"
        />
    </v-card>
</template>

<script setup lang="ts">
import HomeScreenCourses from "@/components/cards/HomeScreenCourses.vue";
import {ref, toRefs} from "vue";

const props = defineProps<{
    title: string;
    data: Array<any>
    type: string
}>();

const { type } = toRefs(props);
const isCourse = ref(false)
if(type.value === "courses"){
    isCourse.value = true
}

</script>

<style scoped>
.v-card {
    background-color: white;
    color: black;
    border-radius: 20px;
}
</style>
