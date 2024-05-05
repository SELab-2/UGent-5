<template>
    <h1>HI</h1>
    <h2 v-if="isErrorGroups">AAUGH</h2>
    <h3 v-if="isLoadingGroups">AA</h3>
</template>

<script setup lang="ts">
import {useProjectGroupsQuery} from "@/queries/Group";
import {computed, toRefs} from "vue";

const props = defineProps<{
    projectId: number;
}>();

const { projectId } = toRefs(props);

const { data: groups, isLoadingGroups, isErrorGroups } = useProjectGroupsQuery(projectId);

const test = computed(() => {
    console.log(groups.value);
    return groups;
})

</script>

<style scoped></style>
