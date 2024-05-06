<template>
    <h1>HI</h1>
    <h2 v-if="groups">ONGA</h2>
    <h2 v-if="isErrorGroups">AAUGH</h2>
    <h3 v-if="isLoadingGroups">AA</h3>
    <ul v-if="groups">
        <li v-for="group in groups" :key="group.id">
            Group ID: {{ group.id }}
        </li>
    </ul>
    {{test}}
</template>

<script setup lang="ts">
import {useProjectGroupsQuery} from "@/queries/Group";
import {computed, toRefs} from "vue";
import {useProjectQuery} from "@/queries/Project";

const props = defineProps<{
    projectId: number;
}>();

const { projectId } = toRefs(props);

const { data: project, isLoading: isLoadingProject, isError: isErrorProject } = useProjectQuery(projectId);

const { data: groups, isLoadingGroups, isErrorGroups } = useProjectGroupsQuery(projectId);

const test = computed(() => {
    console.log(groups.value);
    return groups;
})

</script>

<style scoped></style>
