<template>
    <div :class="getBackgroundClass()" @click="navigateToProject">
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
        projectbtn: true,
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
    margin: 10px;
    width: calc(100% - 20px);
    background-color: white;
    padding: 10px;
    display: flex;
    align-items: center;
    transition: background-color 0.3s;
    border-radius: 10px;
    cursor: pointer;
}

.none {
    background-color: #eeeeee;
}

.accepted {
    background-color: #e3f7e4;
}

.rejected {
    background-color: #ffcaca;
}

.accepted:hover {
    background-color: #c3f2c6;
}

.rejected:hover {
    background-color: #ff9898;
}

.none:hover {
    background-color: lightgray;
}

.rightcontent {
    margin-right: 20px;
    position: absolute;
    right: 0;
}

.p {
    color: lightslategrey;
}
</style>
