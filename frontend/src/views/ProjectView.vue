<template>
    <h2 v-if="isLoading" class="welcome">Loading...</h2>
    <h2 v-else-if="isError" class="welcome">No such project found!</h2>
    <div v-else class="projectInfo">
        <!--<ProjectInfo :project="project!"/> -->
    </div>
</template>


<script setup lang="ts">
import {useProjectQuery} from "@/queries/Project";

const { data: project, isLoading, isError } = useProjectQuery();

</script>

<style scoped>


</style>
