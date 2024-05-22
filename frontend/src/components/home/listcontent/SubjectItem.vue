<template>
    <router-link class="coursebtn" :to="`/subjects/${subject.id}`">
        <div>
            <h3>{{ subject.name }}</h3>
            <v-skeleton-loader v-if="isInstructorsLoading" type="text" />
            <p v-else-if="sortedInstructors.length > 0" class="teacher">
                {{ sortedInstructors[0].given_name + " " + sortedInstructors[0].surname }}
            </p>
        </div>
        <v-icon class="chevron" icon="mdi-chevron-right" />
    </router-link>
</template>

<script setup lang="ts">
import type Subject from "@/models/Subject";
import { toRefs, computed } from "vue";
import { useSubjectInstructorsQuery } from "@/queries/Subject";

const props = defineProps<{
    subject: Subject;
}>();

const { subject } = toRefs(props);

const { data: instructorsData, isLoading: isInstructorsLoading } = useSubjectInstructorsQuery(
    computed(() => subject.value.id)
);

//sorteer zodat teachers voor assistenten tevoorschijn komen
const sortedInstructors = computed(() => {
    if (!instructorsData.value) return [];
    return instructorsData.value.slice().sort((a, b) => {
        return b.is_teacher - a.is_teacher;
    });
});
</script>

<style scoped>
.coursebtn {
    width: calc(100% - 10px);
    margin: 5px;
    padding: 10px;
    display: flex;
    align-items: center;
    transition: background-color 0.3s;
    cursor: pointer;
    background-color: rgb(var(--v-theme-background));
    border-radius: 2px;
    text-decoration: none;
    color: inherit;
}

.coursebtn:hover {
    background-color: rgb(var(--v-theme-tertiary));
}

.chevron {
    margin-right: 20px;
    position: absolute;
    right: 0;
}

.teacher {
    color: rgb(var(--v-theme-textsecondary));
}
</style>
