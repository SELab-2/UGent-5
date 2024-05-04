<template>
    <div class="projectbtn" @click="navigateToProject">
        <div :class="getBackgroundClass()"></div>
        <div class="leftcontent">
            <h3>{{ deadline.project.name }}</h3>
            <p class="p">{{ deadline.project.subject_id }}</p>
        </div>
        <div class="rightcontent">
            {{ formattedDate }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { type Deadline } from "@/models/Project";
import router from "@/router";
import { toRefs, computed } from "vue";

const props = defineProps<{
    deadline: Deadline;
}>();

const { deadline } = toRefs(props);

const getBackgroundClass = () => {
    return {
        block: true,
        accepted: deadline.value.status === "accepted",
        rejected: deadline.value.status === "rejected",
        none: deadline.value.status === "none",
    };
};

const formattedDate = computed(() =>
    deadline.value.project.deadline.toLocaleTimeString([], {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    })
);

const navigateToProject = () => {
    router.push(`/project/${deadline.value.project.id}`);
};
</script>

<style scoped>
.projectbtn {
    margin: 5px;
    background-color: rgb(var(--v-theme-background));
    display: flex;
    transition: background-color 0.3s;
    align-items: center;
    cursor: pointer;
    height: 65px;
    border-radius: 2px;
}

.projectbtn:hover {
    background-color: rgb(var(--v-theme-tertiary));
}

.block {
    margin-left: 10px;
    width: 5px;
    height: 100%;
}

.none {
    background-color: gray;
}

.accepted {
    background-color: green;
}

.rejected {
    background-color: darkred;
}
.leftcontent {
    margin-left: 20px;
}

.rightcontent {
    margin-right: 20px;
    position: absolute;
    right: 0;
}

.p {
    color: rgb(var(--v-theme-textsecondary));
}
</style>
