<template>
    <v-divider></v-divider>
        <div class="coursebtn" @click="navigateToCourse">
            <div>
                <h3>{{ subject.name }}</h3>
                <v-skeleton-loader v-if="isInstructorsLoading" type="text" />
                <p v-else-if="instructors!.length > 0" class="teacher">{{ instructors![0].given_name }}</p>
            </div>
            <v-icon class="chevron" icon="mdi-chevron-right" />
        </div>
</template>

<script setup lang="ts">
import type Subject from "@/models/Subject";
import router from "@/router";
import { toRefs, computed } from "vue";
import { useSubjectInstructorsQuery } from "@/queries/Subject";

const props = defineProps<{
    subject: Subject;
}>();

const { subject } = toRefs(props);

const { data: instructors, isLoading: isInstructorsLoading } = useSubjectInstructorsQuery(computed(() => subject.value.id));

const navigateToCourse = () => {
    router.push(`/subjects/${subject.value.id}`);
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
